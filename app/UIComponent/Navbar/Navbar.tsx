"use client";
import React, { Suspense } from "react";
import Header2 from "./Header2";
import UserProfile from "../UserProfile/UserProfile";
import LoginButton from "../LoginButton/LoginButton";
import NotificationBell from "../Notification/NotificationBell";
import { useAuthContext } from "../context-provider/auth-provider";
export default function Navbar({ logo }: { logo?: React.ReactNode }) {
  const { userData, isSignIn, loaded } = useAuthContext();
  return <header className="site-header"><div className="header-inner site-container">{logo}<Header2 />
    <div className="header-account">{loaded && <Suspense>{isSignIn ? <div className="flex items-center gap-2">{userData?.role !== "admin" && <NotificationBell />}<UserProfile userName={userData?.name} role={userData?.role} /></div> : <LoginButton />}</Suspense>}</div>
  </div></header>;
}
