import { create } from "zustand";

type AuthState = {
  isLoggedIn: boolean;
  hydrate: () => void;
  login: () => void;
  logout: () => void;
};

const STORAGE_KEY = "sos_auth";

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    set({ isLoggedIn: stored === "1" });
  },
  login: () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    set({ isLoggedIn: true });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    set({ isLoggedIn: false });
  },
}));
