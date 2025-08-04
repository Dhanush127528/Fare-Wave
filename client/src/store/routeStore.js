// src/store/routeStore.js
import { create } from "zustand";

export const useRouteStore = create((set) => ({
  route: null,
  setRoute: (src, dest) => set({ route: { src, dest } }),
  clearRoute: () => set({ route: null }),
}));
