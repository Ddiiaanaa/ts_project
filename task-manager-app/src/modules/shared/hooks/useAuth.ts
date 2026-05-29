import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  bio?: string;
}

const getSession = (): User | null => {
  const session = localStorage.getItem('active_session');
  return session ? JSON.parse(session) : null;
};

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getSession);

  useEffect(() => {
    const handleAuthChange = () => setCurrentUser(getSession());
    
    window.addEventListener('auth_change', handleAuthChange);
    return () => window.removeEventListener('auth_change', handleAuthChange);
  }, []);

  const register = (name: string, email: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      alert('Користувач з такою поштою вже існує!');
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      registeredAt: new Date().toLocaleDateString('uk-UA'),
      bio: 'Я використовую Kanban-desk для організації своїх справ!',
    };

    localStorage.setItem('users_db', JSON.stringify([...users, { ...newUser, pass }]));
    localStorage.setItem('active_session', JSON.stringify(newUser));
    
    window.dispatchEvent(new Event('auth_change'));
    return true;
  };

  const login = (email: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    const user = users.find((u: any) => u.email === email && u.pass === pass);
    
    if (user) {
      const { pass: _, ...userData } = user; 
      localStorage.setItem('active_session', JSON.stringify(userData));
      
      window.dispatchEvent(new Event('auth_change'));
      return true;
    }
    
    alert('Невірна пошта або пароль');
    return false;
  };

  const logout = () => {
    localStorage.removeItem('active_session');
    window.dispatchEvent(new Event('auth_change'));
  };

  return { currentUser, register, login, logout };
};