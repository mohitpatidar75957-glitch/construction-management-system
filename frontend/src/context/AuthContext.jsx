import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { ROLE_PERMISSIONS, DEMO_USERS } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [usersList, setUsersList] = useState(() => authService.getAllUsers());

  const login = async (email, password) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const addUser = (userData) => {
    const created = authService.saveUser(userData);
    setUsersList(authService.getAllUsers());
    return created;
  };

  const updatePermissions = (userId, allowedTabs) => {
    const updated = authService.updateUserPermissions(userId, allowedTabs);
    setUsersList(updated);
    setUser(authService.getCurrentUser());
    return updated;
  };

  const canAccess = (tabId) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    // 1. If user has custom assigned permissions by Super Admin, respect them
    if (user.customPermissions && Array.isArray(user.customPermissions)) {
      return user.customPermissions.includes(tabId);
    }
    // 2. Otherwise fallback to standard role permissions
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions) return false;
    return permissions.allowedTabs.includes(tabId);
  };

  const roleMeta = user ? (ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS.SUPER_ADMIN) : null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      addUser,
      updatePermissions,
      usersList,
      canAccess,
      roleMeta,
      isSuperAdmin: user?.role === 'SUPER_ADMIN',
      allRoles: ROLE_PERMISSIONS,
      demoUsers: DEMO_USERS
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;

