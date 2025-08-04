// src/store/userStore.js

import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  name: 'Dhanush',
  wallet: 1500,
  coins: 85,

  setName: (newName) => set({ name: newName }),
  setWallet: (amount) => set({ wallet: amount }),
  setCoins: (count) => set({ coins: count }),

  // ✅ Add this new function for Dashboard.jsx
  setUser: ({ name, wallet, coins }) => {
    if (name) set({ name });
    if (wallet !== undefined) set({ wallet });
    if (coins !== undefined) set({ coins });
  },

  // 🔽 Deduct fare from wallet
  deductFare: (amount) => {
    const current = get().wallet;
    if (current >= amount) {
      set({ wallet: current - amount });
    } else {
      alert("❌ Insufficient balance in wallet!");
    }
  },

  // 🔽 Add coins after successful ride
  addCoins: (count) => {
    const current = get().coins;
    set({ coins: current + count });
  },
}));

export default useUserStore;
