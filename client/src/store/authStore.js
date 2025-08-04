import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = 'http://localhost:5000';

// ✅ Axios interceptor to attach token from Zustand store
axios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      loading: false,
      error: null,

      // ✅ Register
      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post('/api/user/register', {
            name,
            email,
            password,
          });

          const { _id, name: userName, email: userEmail, token } = res.data;
          const user = { _id, name: userName, email: userEmail };

          set({ isLoggedIn: true, user, token, loading: false });
          toast.success('Signup successful!');
        } catch (err) {
          const message = err.response?.data?.error || 'Signup failed';
          set({ error: message, loading: false });
          toast.error(message);
        }
      },

      // ✅ Login
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post('/api/user/login', {
            email,
            password,
          });

          const { _id, name, email: userEmail, token } = res.data;
          const user = { _id, name, email: userEmail };

          set({ isLoggedIn: true, user, token, loading: false });
          toast.success('Login successful!');
        } catch (err) {
          const message = err.response?.data?.error || 'Login failed';
          set({ error: message, loading: false });
          toast.error(message);
        }
      },

      // 🔓 Logout
      logout: () => {
        toast.success('Logged out');
        set({
          isLoggedIn: false,
          user: null,
          token: null,
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: 'farewave-auth', // localStorage key
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
