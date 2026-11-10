import { cookies } from "next/headers";
import { IAuthToken, IAuthUser } from "../../types";
import { CookieTokenName } from "./types";
import { isDeveopment } from "@/app/backend/constant";
import JwtTokenService from "../jwt-service";
import { CryptoToken } from "../crypto-token";
import { deleteCookie, setCookie } from "./actions";

export class CookiesService {
  constructor() {}
  static async setSecureCookie(key: string, value: string) {
    await setCookie(key, value, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  }
  static async setSecureCookies(cookiesData: { key: string; value: string }[]) {
    cookiesData.forEach(async (co) => {
      await this.setSecureCookie(co.key, co.value);
    });
  }
  static async deleteCoookies(keys: string[]) {
    keys.forEach(async (key) => {
      await deleteCookie(key);
    });
  }
  static async setLoginCookies(accessToken: string, refreshToken: string) {
    let [header, payload, signature] = accessToken.split(".");

    const cryptoService = new CryptoToken();
    if (!isDeveopment) {
      header = cryptoService.encryptMessage(header);
      payload = cryptoService.encryptMessage(payload);
      signature = cryptoService.encryptMessage(signature);
    }
    this.setSecureCookies([
      { key: CookieTokenName.header, value: header },
      { key: CookieTokenName.payload, value: payload },
      { key: CookieTokenName.signature, value: signature },
      { key: CookieTokenName.refreshToken, value: refreshToken },
    ]);
  }
  static async deleteLoginCookies() {
    this.deleteCoookies([
      CookieTokenName.header,
      CookieTokenName.payload,
      CookieTokenName.signature,
      CookieTokenName.refreshToken,
    ]);
  }
  static async getLoginCookies(): Promise<IAuthToken> {
    let cookie = await cookies();
    const refreshToken = cookie.get(CookieTokenName.refreshToken);
    let header = cookie.get(CookieTokenName.header)?.value;
    let payload = cookie.get(CookieTokenName.payload)?.value;
    let signature = cookie.get(CookieTokenName.signature)?.value;

    if (!header || !payload || !signature || !refreshToken?.value) {
      return {
        accessToken: "",
        refreshToken: "",
      };
    }
    const cryptoService = new CryptoToken();
    if (!isDeveopment) {
      header = cryptoService.decryptMessage(header);
      payload = cryptoService.decryptMessage(payload);
      signature = cryptoService.decryptMessage(signature);
    }
    return {
      accessToken: `${header}.${payload}.${signature}`,
      refreshToken: refreshToken?.value || "",
    };
  }

  static async getUserDetailsFromAccessToken(): Promise<IAuthUser | null> {
    const token = await this.getLoginCookies();
    const jwtService = new JwtTokenService();

    return await jwtService.getUserDetailsFromAccessToken(
      token.accessToken,
      token.refreshToken
    );
  }
  static async getValueFromCookie(key: string): Promise<string | null> {
    let cookie = await cookies();
    return cookie.get(key)?.value || null;
  }

  static async getAccessToken(): Promise<string> {
    const token = await this.getLoginCookies();
    return token?.accessToken || "";
  }

  static async getSessionCookie(): Promise<string> {
    return await this.getValueFromCookie("besSessionCookies");
  }
  static async setSessionCookie() {
    await this.setSecureCookie("besSessionCookies", Date.now().toString());
  }
}
