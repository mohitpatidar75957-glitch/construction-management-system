import React, { createContext, useContext, useState, useEffect } from 'react';
import projectService from '../services/projectService';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const refreshProjects = () => {
    setLoading(true);
    projectService.getAll()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        selectedProjectId, 
        setSelectedProjectId, 
        refreshProjects, 
        loading 
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}

export default ProjectContext;

