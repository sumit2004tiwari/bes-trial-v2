import { checkUserLoginStatus, logout } from "@/app/frontend/actions/login";
import { trackFormCompleted } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";
import React, { useEffect, useState } from "react";
import { AuthContextReturn, IUserData } from "./types";
import { redirect } from "next/navigation";
import { ProtectedRoutes } from "../protected-pages";

const AuthContext = React.createContext<AuthContextReturn>(null);
const isProtectedRoute = (path: string) => {
  return ProtectedRoutes.some((route) => {
    if (route.endsWith("/*")) {
      return path.startsWith(route.slice(0, -2));
    }
    return path === route;
  });
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const updateUserState = (userData: IUserData) => {
    if (userData) {
      let firstName = userData?.firstName || "";
      let lastName = userData?.lastName || "";
      let name = "";
      if (!firstName && !lastName) {
        name = userData?.email?.split("@")[0];
      } else {
        name = firstName + " " + lastName;
      }
      let newUserData = {
        ...userData,
        name: name,
      };
      setUserData(newUserData);
      return;
    }

    setUserData(userData);
  };
  const onLogout = async () => {
    trackFormCompleted(AnalyticsEvents.LOGOUT);
    await logout();
    setUserData(null);
    redirect("/");
  };
  useEffect(() => {
    if (process.env.FRONTEND_DEMO_MODE === "true") {
      setLoaded(true);
      return;
    }
    if (true) {
      checkUserLoginStatus()
        .then((res) => {
          updateUserState(res?.data);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoaded(true);
        });
    }
  }, []);
  useEffect(() => {
    if (loaded && !userData && isProtectedRoute(window.location.pathname)) {
      redirect("/?action=login");
    }
  }, [loaded, userData]);
  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData: updateUserState,
        onLogout,
        isSignIn: !!userData,
        loaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
