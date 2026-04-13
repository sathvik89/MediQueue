import type { User } from '../types';

export const mockLogin = async (email: string, role: string): Promise<User> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        name: `Mock ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email,
        role: role as User['role'],
      });
    }, 1000);
  });
};

export const mockRegister = async (name: string, email: string, role: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: role as User['role'],
      });
    }, 1000);
  });
};
