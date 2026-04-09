import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setCredentials: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      updateUser: (user, token) => set((state) => ({ user, token: token || state.token })),
      setSavedPosts: (savedPosts) => set((state) => ({ user: { ...state.user, savedPosts } })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
