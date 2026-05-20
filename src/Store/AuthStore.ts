import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IUser {
  fullname: string;
  username: string;
  email: string;
}

interface IUserState {
  user: IUser | null;
  setUser: (userInfo: IUser) => void;
  logout: () => void;
}

export const useAuthStore = create<IUserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userInfo: IUser) => set({ user: userInfo }),
      logout: () => set({ user: null })
    }),
    {
      name: "auth-storage"
    }
  )
);