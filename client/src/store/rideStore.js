// src/store/rideStore.js

import { create } from "zustand";

export const useRideStore = create((set) => ({
  status: "idle", // idle → checkedIn → checkedOut
  start: null,
  end: null,
  fare: 0,

  checkIn: (start) =>
    set(() => ({
      status: "checkedIn",
      start,
      end: null,
      fare: 0,
    })),

  checkOut: (endTime, fare) =>
    set((state) => ({
      status: "checkedOut",
      end: { time: endTime },
      fare,
    })),

  resetRide: () =>
    set(() => ({
      status: "idle",
      start: null,
      end: null,
      fare: 0,
    })),
}));
