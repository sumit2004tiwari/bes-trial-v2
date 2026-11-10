import SideNav from "./SideNav/SideNav";
import MobileBottomNavWrapper from "@/app/UIComponent/MobileBottomNavWrapper";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="section-layout"><aside className="section-sidebar" aria-label="Past event sections"><SideNav /></aside><article className="section-content">{children}</article><MobileBottomNavWrapper title="Past events"><SideNav /></MobileBottomNavWrapper></div>;
}
