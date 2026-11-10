import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";
import { CookiesService } from "@/app/backend/lib/services/cookies-service";

export async function POST(request: Request) {
  try {
    const loginCookies = await CookiesService.getLoginCookies();
    const accessToken = loginCookies?.accessToken;
    const refreshToken = loginCookies?.refreshToken;
    if (!accessToken || !refreshToken) {
      throw new Error("Missing credentials");
    }

    const authService = new UserAuthService();
    const user = await authService.validateAndRegenerateTokenAndSetCookie();
    if (user) {
      return new Response(
        JSON.stringify({
          message: "Valid Credential",
          loginStatus: true,
          data: { ...user },
        }),
        { status: 200 }
      );
    }

    throw new Error("Invalid credentials");
  } catch (e) {
    // await CookiesService.deleteLoginCookies();
    console.log("this login cookie", e);
    return new Response(
      JSON.stringify({ message: "Not Valid Credential", loginStatus: false }),
      { status: 401 }
    );
  }
}
