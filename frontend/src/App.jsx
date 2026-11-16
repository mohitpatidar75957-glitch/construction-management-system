import React, { useState, useEffect } from "react";
import MainLayout from "./components/layout/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import LoginPage from "./components/auth/LoginPage";
import UserProfileView from "./components/profile/UserProfileView";

function AppContent() {
  const { user, canAccess } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showProfileView, setShowProfileView] = useState(false);

  // Auto-redirect if current active tab is forbidden for logged in role
  useEffect(() => {
    if (user && !canAccess(activeTab)) {
      const fallback = user.role === 'CLIENT' ? 'customer_portal' : 'overview';
      setActiveTab(fallback);
    }
  }, [user, activeTab, canAccess]);

  if (!user) {
    return <LoginPage />;
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowProfileView(false);
  };

  return (
    <ProjectProvider>
      <MainLayout 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onRefresh={() => setRefreshKey(k => k + 1)}
        onOpenProfile={() => setShowProfileView(true)}
      >
        {showProfileView ? (
          <UserProfileView 
            onBack={() => setShowProfileView(false)}
            onNavigateSettings={() => {
              setShowProfileView(false);
              setActiveTab('settings');
            }}
          />
        ) : (
          <div key={`${activeTab}-${refreshKey}`}>
            <AppRoutes activeTab={activeTab} />
          </div>
        )}
      </MainLayout>
    </ProjectProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
