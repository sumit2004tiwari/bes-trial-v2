import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { geolocation } from "@vercel/functions";

/* =====================================================
   CONSTANTS
===================================================== */

const VISITOR_COOKIE = "besSessionCookies";
const EDGE_GUARD_HEADER = "x-edge-visitor-guard";
const ADMIN_PATH = ["/admin"];
const PROTECTED_PATHS = ["/user", ...ADMIN_PATH];

const AUTH_VALIDATE_ENDPOINT = "/backend/api/auth/loginCheck/validateToken";

/* =====================================================
   HELPERS
===================================================== */

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
function isAminPath(pathname) {
  return ADMIN_PATH.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
/* =====================================================
   MIDDLEWARE
===================================================== */

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (process.env.FRONTEND_DEMO_MODE === "true") {
    const pathname = request.nextUrl.pathname;
    if (
      pathname === "/backend/api" || pathname.startsWith("/backend/api/") ||
      pathname === "/api" || pathname.startsWith("/api/") ||
      request.headers.has("next-action") ||
      (request.method !== "GET" && request.method !== "HEAD")
    ) {
      return NextResponse.json(
        { status: false, message: "This is a frontend demo. Backend features and form submissions are disabled." },
        { status: 503 }
      );
    }
    if (isProtectedPath(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  /* =====================================================
     STEP 1: Filter Out Non-Real Users
  ===================================================== */

  // 1a. Skip prefetch requests
  if (request.headers.get("purpose") === "prefetch") {
    return response;
  }

  // 1b. Skip Next.js internal requests
  if (request.headers.get("x-middleware-prefetch")) {
    return response;
  }

  // 1c. Comprehensive bot detection
  const ua = request.headers.get("user-agent")?.toLowerCase() || "";

  const botPatterns = [
    "bot",
    "crawler",
    "spider",
    "scraper",
    "googlebot",
    "bingbot",
    "yandexbot",
    "duckduckbot",
    "baiduspider",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "whatsapp",
    "slackbot",
    "telegrambot",
    "discordbot",
    "headless",
    "phantom",
    "selenium",
    "webdriver",
    "curl",
    "wget",
    "python-requests",
    "go-http-client",
    "java/",
    "apache-httpclient",
    "okhttp",
  ];

  if (botPatterns.some((pattern) => ua.includes(pattern))) {
    return response;
  }

  // 1d. Detect headless browsers
  if (!ua || ua === "mozilla/5.0") {
    return response;
  }

  /* =====================================================
     STEP 2: Skip API & Internal Calls
  ===================================================== */

  if (request.headers.get(EDGE_GUARD_HEADER)) {
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/backend/api") || request.nextUrl.pathname.startsWith("/api/")) {
    return response;
  }

  /* =====================================================
     STEP 2.4: Set Client Geolocation Cookie
     (for client-side geo features e.g. phone country auto-detect)
  ===================================================== */

  // Vercel does not reliably populate request.geo in middleware;
  // @vercel/functions reads the guaranteed x-vercel-ip-* headers.
  const geoData = geolocation(request);
  const geoLocation = {
    country: geoData?.country?.toLowerCase() ?? "",
    countryRegion: geoData?.countryRegion?.toLowerCase() ?? "",
    city: geoData?.city ?? "",
    region: geoData?.region ?? "",
    latitude: geoData?.latitude ?? "",
    longitude: geoData?.longitude ?? "",
  };
  const hasGeo = geoLocation.country || geoLocation.city || geoLocation.latitude;
  if (hasGeo) {
    const geoCookieValue = JSON.stringify(geoLocation);
    const existingValue = request.cookies.get("bes_client_geo")?.value;
    if (existingValue !== geoCookieValue) {
      response.cookies.set("bes_client_geo", geoCookieValue, {
        httpOnly: false,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }
  }

  /* =====================================================
     STEP 2.5: AUTH VALIDATION (user/*, admin/*)
  ===================================================== */

  if (isProtectedPath(request.nextUrl.pathname)) {
    try {
      const cookieHeader = request.headers.get("cookie");

      const validateResponse = await fetch(
        `${request.nextUrl.origin}${AUTH_VALIDATE_ENDPOINT}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(cookieHeader ? { cookie: cookieHeader } : {}),
            [EDGE_GUARD_HEADER]: "1",
          },
          cache: "no-store",
        }
      );
      let response = await validateResponse.json();

      if (response?.loginStatus) {
        if (isAminPath(request.nextUrl.pathname)) {
          if (response?.data?.role === "admin") {
            console.log("pass this response");
          } else {
            const loginUrl = new URL("/", request.url);
            loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
          }
        }
      } else {
        const loginUrl = new URL("/?action=login", request.url);
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  /* =====================================================
     STEP 3: Visitor Tracking (ONE TIME)
  ===================================================== */

  const existingCookie = request.cookies.get(VISITOR_COOKIE);
  if (existingCookie) {
    return response;
  }

  const timestamp = Date.now();

  response.cookies.set(VISITOR_COOKIE, timestamp.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });

  /* =====================================================
     STEP 4: Fire Tracking Request (Non-blocking)
  ===================================================== */

  try {
    const cookieHeader = request.headers.get("cookie");

    fetch(`${request.nextUrl.origin}/backend/api/track-visitor`, {
      method: "POST",
      headers: {
        "x-internal-secret": process.env.INTERNAL_SECRET!,
        "content-type": "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        [EDGE_GUARD_HEADER]: "1",
      },
      body: JSON.stringify({
        path: request.nextUrl.pathname,
        referrer: request.headers.get("referer") || "direct",
        timestamp,
        userAgent: request.headers.get("user-agent"),
        country: (request as any)?.geo?.country || "unknown",
        city: (request as any)?.geo?.city || "unknown",
      }),
    });
  } catch (error) {
    console.error("Tracking failed:", error);
  }

  return response;
}

/* =====================================================
   MATCHER
===================================================== */

export const config = {
  matcher: [
    "/backend/api/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|backend/api/auth|backend/api/track-visitor|api|.*\\.(?:pdf|png|jpg|jpeg|gif|svg|webp|ico|css|js|map|woff|woff2|ttf|eot|txt|xml|json)).*)",
  ],
};
