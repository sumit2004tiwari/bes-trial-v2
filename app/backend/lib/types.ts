import { FlattenMaps } from "mongoose";
import { IUser } from "./db/models/user-schema";

export interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}

export interface SignupData extends UserData {
  passwordHash: string;
  unique: string;
  verificationToken: string;
  verificationTokenExpires: Date;
}

export type UserObject = FlattenMaps<IUser> & { _id: string };

export interface PlainUserObject {
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
  role: string;
  status: string;
  passwordHash: string;
  email: string;
  id: string;
}
export interface ILoginDetails {
  refreshToken?: string;
  accessToken?: string;
  isLogin: boolean;
  needToVerifyUsingOtp: boolean;
  payloadToken?: string;
}

export interface IAuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthSession {
  accessToken: string;
}

export interface IAuthUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}
