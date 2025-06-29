import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, RegisterData } from '@/types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true, // Start with loading true

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/mock/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          if (!res.ok) throw new Error('Login failed');
          
          const { user, token } = await res.json();
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (key === 'files') {
              (value as File[]).forEach((file, index) => {
                formData.append(`file_${index}`, file);
              });
            } else {
              formData.append(key, value as string);
            }
          });

        //   const {
        //     username,
        //     email,
        //     password,
        //     deviceName,
        //     imei,
        //     phoneNumber,
        //     plan,
        //     files,
        //   } = req.body;

          const res = await fetch('/api/mock/auth/register', {
            method: 'POST',
            body: formData,
          });
          
          if (!res.ok) throw new Error('Registration failed');
          
          const { user, token } = await res.json();
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      checkAuth: () => {
        const { token } = get();
        if (!token) {
          set({ user: null });
        }
        set({ isLoading: false }); // Always set loading to false after check
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Called after rehydration, ensure we check auth
        if (state) {
          state.checkAuth();
        }
      },
    }
  )
);
