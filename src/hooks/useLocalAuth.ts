import { useState, useEffect, useCallback } from 'react';

interface User {
  username: string;
  createdAt: string;
}

interface StoredUser {
  username: string;
  password: string;
  createdAt: string;
}

const USERS_KEY = 'gemini_users';
const CURRENT_USER_KEY = 'gemini_current_user';

export function useLocalAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current user on mount
  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = useCallback((): StoredUser[] => {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }, []);

  const saveUsers = useCallback((users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, []);

  const signUp = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    const users = getUsers();
    const exists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (exists) {
      return { success: false, error: 'Username already exists' };
    }

    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }

    const newUser: StoredUser = {
      username,
      password,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    
    const currentUser: User = { username, createdAt: newUser.createdAt };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    setUser(currentUser);

    return { success: true };
  }, [getUsers, saveUsers]);

  const signIn = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    const users = getUsers();
    const found = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid username or password' };
    }

    const currentUser: User = { username: found.username, createdAt: found.createdAt };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    setUser(currentUser);

    return { success: true };
  }, [getUsers]);

  const signOut = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
  };
}
