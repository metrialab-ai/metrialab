import { User, Project } from '../types';

const DB_KEYS = {
  USERS: 'metria_users',
  CURRENT_USER: 'metria_current_user',
  PROJECTS: 'metria_projects'
};

export const db = {
  // User Management
  getUsers: (): User[] => {
    const data = localStorage.getItem(DB_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  
  saveUser: (user: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    // Update session if it's the current user
    const currentUser = db.getCurrentUser();
    if (currentUser && currentUser.email === user.email) {
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(DB_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  login: (email: string): User | null => {
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  },

  // Project Management
  getProjects: (userId: string): Project[] => {
    const data = localStorage.getItem(DB_KEYS.PROJECTS);
    const projects: Project[] = data ? JSON.parse(data) : [];
    return projects.filter(p => p.userId === userId);
  },

  getProjectById: (id: string): Project | undefined => {
    const data = localStorage.getItem(DB_KEYS.PROJECTS);
    const projects: Project[] = data ? JSON.parse(data) : [];
    return projects.find(p => p.id === id);
  },

  saveProject: (project: Project) => {
    const data = localStorage.getItem(DB_KEYS.PROJECTS);
    let projects: Project[] = data ? JSON.parse(data) : [];
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(projects));
  },

  deleteProject: (id: string) => {
    const data = localStorage.getItem(DB_KEYS.PROJECTS);
    let projects: Project[] = data ? JSON.parse(data) : [];
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem(DB_KEYS.PROJECTS, JSON.stringify(projects));
  }
};
