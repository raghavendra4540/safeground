import { create } from 'zustand';
import * as authApi from '../services/auth.api.js';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const res = await authApi.getMe();
      set({ user: res.data.user, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await authApi.login({ email, password });
      set({ user: res.data.user, token: res.data.token, loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  },

  logout: async () => {
    try { await authApi.logout(); } catch {}
    set({ user: null, token: null });
  },

  setUser: (user) => set({ user }),
}));

export default useAuthStore;
