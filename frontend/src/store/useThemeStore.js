import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("profile-theme") || "green",
  setTheme: (theme) => {
    localStorage.setItem("profile-theme", theme);
    set({ theme });
  },
}));