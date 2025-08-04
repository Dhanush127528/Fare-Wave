// src/store/rideHistoryStore.js

import { create } from 'zustand';

const useRideHistoryStore = create((set) => ({
  rides: [],

  addRide: (ride) =>
    set((state) => ({
      rides: [...state.rides, ride],
    })),

  clearHistory: () => set({ rides: [] }),

  // ✅ Added for Dashboard.jsx
  setRideHistory: (history) => set({ rides: history }),
}));

export default useRideHistoryStore;
