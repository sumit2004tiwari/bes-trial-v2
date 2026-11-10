"use client";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import menu from "../Navbar/Utility/menudb.json";
import exhibition from "@/app/event_conference/bes_expo/SideNav/db.json";
import conference from "@/app/event_conference/bes_expo/SideNav/db2.json";

const labels: Record<string, string> = {
  expos: "Expo archive", seminars: "Seminar archive", other: "Resources",
  invalid_token: "Account recovery", offline: "Offline access", services: "Services", "all-registrations": "Registrations", members: "Members", visitors: "Visitors", delegates: "Delegates", "my-space": "Exhibition bookings", "bes-event-config": "Event configuration", "all-registration-service": "Registration services",
  about_bes: "The society", event_conference: "Events", bes_expo: "BES EXPO 2027", exibition: "Exhibition", conference: "Conference", other_events: "Past events", galleries: "Gallery", pictures: "Event gallery", registrationform: "Registration", visitor: "Visitor registration", delegateregistration: "Delegate registration", member_signup: "Become a member", account_setup: "Set up your account", "e-badges": "Event badges", "download-badge": "Download your badge", userful_links: "Useful links",
};
const extraLabels = [...menu.flatMap<{ path: string; name: string }>(item => item.subChildren || []), ...exhibition, ...conference];
extraLabels.forEach(item => { if (item.path) labels[item.path.split("/").filter(Boolean).pop()] = item.name.trim(); });

export default function PageFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  useEffect(() => { document.querySelector(".inner_page")?.scrollTo({ top: 0 }); }, [pathname]);
  if (pathname === "/") return <main id="main-content" tabIndex={-1}>{children}</main>;
  const segments = pathname.split("/").filter(Boolean);
  const title = segments.includes("account_setup") ? "Set up your account" : segments.includes("download-badge") ? "Download your badge" : segments.includes("previous_council") && segments.length > 2 ? `Council ${segments.at(-1)}` : labels[segments.at(-1)] || segments.at(-1)?.replace(/[_-]/g, " ");
  const section = segments.includes("bes_expo") ? "BES EXPO 2027" : segments.includes("about_bes") ? "Broadcast Engineering Society (India)" : "BES India";
  return <main id="main-content" tabIndex={-1} className="interior-page">
    <div className="page-intro"><div className="site-container">
      <nav aria-label="Breadcrumb" className="breadcrumbs"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{section}</span><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
      <div className="eyebrow">{section}</div><h1>{title}</h1><div className="page-intro-line" />
    </div></div>
    <div className="interior-body">{children}</div>
  </main>;
}
