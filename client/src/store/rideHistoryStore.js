// src/store/rideHistoryStore.js

import { create } from 'zustand';

// LocalStorage key
const STORAGE_KEY = "farewave_ride_history";

// Load from localStorage
const getInitialRides = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const useRideHistoryStore = create((set) => ({
  rides: getInitialRides(),

  addRide: (ride) =>
    set((state) => {
      const updated = [...state.rides, ride];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { rides: updated };
    }),

  clearHistory: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ rides: [] });
  },

  setRideHistory: (history) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    set({ rides: history });
  },
}));

export default useRideHistoryStore;
