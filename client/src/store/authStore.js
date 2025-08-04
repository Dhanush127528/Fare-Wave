import { create } from 'zustand';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem('fakeToken'),
  user: localStorage.getItem('fakeUserName')
    ? { name: localStorage.getItem('fakeUserName') }
    : null,
  token: localStorage.getItem('fakeToken') || null,
  loading: false,
  error: null,

  // ✅ Mock Register
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    setTimeout(() => {
      localStorage.setItem('fakeToken', '1234567890');
      localStorage.setItem('fakeUserName', name);
      set({
        isLoggedIn: true,
        user: { name },
        token: '1234567890',
        loading: false,
      });
      toast.success('Signup successful!');
    }, 1000);
  },

  // ✅ Mock Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    setTimeout(() => {
      const name = localStorage.getItem('fakeUserName') || 'Guest';
      localStorage.setItem('fakeToken', '1234567890');
      set({
        isLoggedIn: true,
        user: { name },
        token: '1234567890',
        loading: false,
      });
      toast.success('Login successful!');
    }, 1000);
  },

  // 🔓 Logout
  logout: () => {
    localStorage.clear();
    set({
      isLoggedIn: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
    toast.success('Logged out');
  },
}));

export default useAuthStore;
