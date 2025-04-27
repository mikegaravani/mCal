import { create } from "zustand";
import { fetchMe } from "@/api/auth";

type User = {
  username: string;
  email?: string;
};

type UserStore = {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,

  fetchUser: async () => {
    set({ loading: true });
    try {
      const response = await fetchMe();
      set({ user: response.data.user });
    } catch (error) {
      console.error("Failed to fetch user", error);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
}));
