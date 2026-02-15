import { create } from "zustand";

export interface MembershipState {
  reset: () => void;
}

export const useMembershipState = create<MembershipState>((set, get) => {
  return {
    reset: () => set({}),
  };
});
