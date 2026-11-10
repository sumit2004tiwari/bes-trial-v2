import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";

export async function POST(request: Request) {
  try {
    let authManager = new UserAuthService();
    await authManager.logout();
  } catch (e) {
    console.log("error while login out", e?.message);
  } finally {
    return new Response(
      JSON.stringify({ message: "Logout Successfully", loginStatus: false }),
      { status: 200 }
    );
  }
}
