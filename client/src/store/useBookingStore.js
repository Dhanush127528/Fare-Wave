import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  route: null,
  setRoute: (src, dest) => set({ route: { src, dest } }),
  clearRoute: () => set({ route: null }),
}));
