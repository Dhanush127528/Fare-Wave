// src/store/userStore.js

import { create } from "zustand";

const STORAGE_KEY = "farewave_user";

// ✅ Default fallback values
const defaultUser = {
  name: "Dhanush",
  wallet: 1500,
  coins: 85,
};

const useUserStore = create((set, get) => {
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultUser;
    } catch {
      return defaultUser;
    }
  };

  const persist = (data) => {
    const current = get();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // ✅ initialize with saved or default user
  const initial = loadFromStorage();

  return {
    name: initial.name,
    wallet: initial.wallet,
    coins: initial.coins,

    setName: (newName) => {
      set({ name: newName });
      persist({ name: newName });
    },

    setWallet: (amount) => {
      set({ wallet: amount });
      persist({ wallet: amount });
    },

    setCoins: (count) => {
      set({ coins: count });
      persist({ coins: count });
    },

    setUser: ({ name, wallet, coins }) => {
      const updates = {};
      if (name !== undefined) updates.name = name;
      if (wallet !== undefined) updates.wallet = wallet;
      if (coins !== undefined) updates.coins = coins;

      set(updates);
      persist(updates);
    },

    deductFare: (amount) => {
      const current = get().wallet;
      if (current >= amount) {
        const newWallet = current - amount;
        set({ wallet: newWallet });
        persist({ wallet: newWallet });
      } else {
        alert("❌ Insufficient balance in wallet!");
      }
    },

    addCoins: (count) => {
      const newCoins = get().coins + count;
      set({ coins: newCoins });
      persist({ coins: newCoins });
    },
  };
});

export default useUserStore;
