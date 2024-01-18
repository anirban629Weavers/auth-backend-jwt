import { create } from "zustand";


export interface IUserSession  {

    _id: string;
    name: string;
    email: string;
    isAdmin: false;
    accessToken: string;
    refreshToken: string;
  };

type State = {
  session:
    | undefined
    | {
        user:IUserSession
      };
};

type Action = {
  resetSession: () => void;
  updateSession: (user:IU) => void;
};

// Create your store, which includes both state and (optionally) actions
const usePersonStore = create<State & Action>((set) => ({
  firstName: "",
  lastName: "",
  updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
  updateLastName: (lastName) => set(() => ({ lastName: lastName })),
}));
