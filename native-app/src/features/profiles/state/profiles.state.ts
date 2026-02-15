import { create } from "zustand";

export interface ProfilesState {
  reset: () => void;
}

export const useProfilesState = create<ProfilesState>((set, get) => {
  return {
    reset: () => set({}),
  };
});
