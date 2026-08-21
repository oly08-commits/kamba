import { langs } from "@/shared/i18n";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LanguageState {
  lang: langs;
  setLanguage: (lang: langs) => void;
  switchLanguage: () => void;
}

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },

  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },

  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: "pt",

      setLanguage: (lang) => {
        set({ lang });
      },

      switchLanguage: () => {
        set((state) => ({
          lang: state.lang === "pt" ? "en" : "pt",
        }));
      },
    }),
    {
      name: "language-storage",

      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
