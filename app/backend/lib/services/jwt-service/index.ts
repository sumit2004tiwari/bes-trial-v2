import { JWT_SECRET_KEY } from "@/app/backend/config/constant";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IAuthUser } from "../../types";
import { mapAuthUserToAuthUser } from "../utils/user";
export default class JwtTokenService {
  private secretKey: string;
  constructor() {
    this.secretKey = JWT_SECRET_KEY;
    if (!this.secretKey) {
      throw new Error(
        "JWT_SECRET_KEY is not defined in environment variables."
      );
    }
  }
  async createToken(
    payload: string | object,
    duration: SignOptions["expiresIn"]
  ): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: duration });
  }
  async createTokenUsingRefresh(
    payload: IAuthUser,
    refreshToken: string,
    duration: SignOptions["expiresIn"]
  ) {
    return jwt.sign(payload, this.secretKey + refreshToken, {
      expiresIn: duration,
    });
  }

  async verifyTokenWithExpiry(token: string) {
    try {
      jwt.verify(token, this.secretKey);
      return { valid: true, expired: false };
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return { valid: false, expired: true };
      }
      return { valid: false, expired: false };
    }
  }
  async verifyLoginTokenWithExpiry(token: string, refreshToken: string) {
    try {
      jwt.verify(token, this.secretKey + refreshToken);
      return { valid: true, expired: false };
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return { valid: true, expired: true };
      }
      return { valid: false, expired: false };
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      return !!jwt.verify(token, this.secretKey);
    } catch (e) {
      return false;
    }
  }
  async decodeToken(token: string) {
    return jwt.decode(token);
  }
  async createLoginAccessToken(name: string, email: string) {}
  async comparePassword(
    passwordHash: string,
    password: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, passwordHash);
    } catch (e) {
      return false;
    }
  }
  async getUserDetailsFromAccessToken(token: string, refreshToken?: string) {
    let decodedToken: any;
    if (refreshToken) {
      try {
        decodedToken = jwt.verify(token, this.secretKey + refreshToken);
      } catch (e) {
        return null;
      }
    } else {
      decodedToken = jwt.decode(token);
    }
    if (!decodedToken) {
      return null;
    }
    let parseUser: IAuthUser;
    parseUser = mapAuthUserToAuthUser(decodedToken as IAuthUser);
    return {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      status: "",
      ...parseUser,
    };
  }
}
