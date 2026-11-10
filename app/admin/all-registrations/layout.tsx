import SideNav from "./sideNav";
import MobileBottomNavWrapper from "@/app/UIComponent/MobileBottomNavWrapper";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="section-layout"><aside className="section-sidebar" aria-label="Registration management"><SideNav /></aside><div className="section-content">{children}</div><MobileBottomNavWrapper title="Registrations"><SideNav /></MobileBottomNavWrapper></div>;
}
