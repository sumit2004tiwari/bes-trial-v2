import { IAuthUser } from "@/app/backend/lib/types";

export interface IUserData extends IAuthUser {
  name: string;
}

export interface AuthContextReturn {
  userData: IUserData;
  setUserData: (userData: IAuthUser) => void;
  onLogout: () => void;
  isSignIn: boolean;
  loaded: boolean;
}
