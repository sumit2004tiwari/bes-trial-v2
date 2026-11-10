import { IAuthUser, PlainUserObject, UserObject } from "../../types";

export const userToUser = (user: UserObject): PlainUserObject => {
  return {
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    status: user.status,
    id: user._id.toString(),
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    passwordHash: user.passwordHash,
  };
};

export const mapAuthUserToAuthUser = (user: IAuthUser): IAuthUser => {
  return {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    role: user?.role,
    status: user?.status,
  };
};
