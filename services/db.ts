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
    if (!data) {
        // Seed default admin if DB is empty
        const defaultAdmin: User = {
            id: 'default-admin-001',
            email: 'admin@metria.com',
            name: 'Administrador Metria',
            role: 'Administrador',
            company: 'Metria HQ',
            country: 'Brasil',
            state: 'SP',
            city: 'São Paulo',
            phone: '+55 11 99999-9999',
            isGoogleUser: false,
            isProfileComplete: true,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify([defaultAdmin]));
        return [defaultAdmin];
    }
    return JSON.parse(data);
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

  deleteUser: (id: string) => {
    const data = localStorage.getItem(DB_KEYS.USERS);
    let users: User[] = data ? JSON.parse(data) : [];
    users = users.filter(u => u.id !== id);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(DB_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  login: (email: string): User | null => {
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      db.saveUser(user);
      
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
    const userProjects = projects.filter(p => p.userId === userId);
    // Sort by createdAt descending (newest first)
    return userProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Admin: Get All Projects
  getAllProjects: (): Project[] => {
    const data = localStorage.getItem(DB_KEYS.PROJECTS);
    const projects: Project[] = data ? JSON.parse(data) : [];
    return projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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