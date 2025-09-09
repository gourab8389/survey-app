import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser } from '@/types/form.types';

interface AuthStore {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
  checkSession: () => void;
}

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      
      login: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          if (response.ok) {
            const user: AuthUser = {
              email,
              isAuthenticated: true,
              loginTime: Date.now(),
            };
            set({ user });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: () => {
        set({ user: null });
      },
      
      isAuthenticated: () => {
        const { user } = get();
        if (!user) return false;
        
        // Check if session is older than 1 week
        const isExpired = Date.now() - user.loginTime > WEEK_IN_MS;
        if (isExpired) {
          get().logout();
          return false;
        }
        
        return user.isAuthenticated;
      },
      
      checkSession: () => {
        const { user } = get();
        if (user && Date.now() - user.loginTime > WEEK_IN_MS) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);