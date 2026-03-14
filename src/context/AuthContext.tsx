import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'student' | 'instructor' | 'coordinator';

export interface User {
  id: string; // ID Number
  name: string;
  role: Role;
  course?: string;
  year?: string;
  section?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (id: string, password?: string) => void;
  logout: () => void;
  register: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = (id: string, password?: string) => {
    let users: User[] = [];
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]');
    } catch (e) {
      users = [];
    }
    const foundUser = users.find((u) => u.id === id && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    } else {
      // For demo purposes, if it's a specific ID, let them in
      if (id === 'admin') {
        const adminUser: User = { id: 'admin', name: 'Admin Coordinator', role: 'coordinator' };
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
      } else if (id === 'instructor') {
        const instructorUser: User = { id: 'instructor', name: 'Test Instructor', role: 'instructor' };
        setUser(instructorUser);
        localStorage.setItem('currentUser', JSON.stringify(instructorUser));
      } else {
        alert('Invalid credentials');
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (newUser: User) => {
    let users: User[] = [];
    try {
      users = JSON.parse(localStorage.getItem('users') || '[]');
    } catch (e) {
      users = [];
    }
    if (users.find(u => u.id === newUser.id)) {
      alert('User already exists');
      return;
    }
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
