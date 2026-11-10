import SideNav from "./SideNav/SideNav";
import MobileBottomNavWrapper from "../UIComponent/MobileBottomNavWrapper";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="section-layout"><aside className="section-sidebar" aria-label="Society sections"><SideNav /></aside><article className="section-content">{children}</article><MobileBottomNavWrapper title="About BES"><SideNav /></MobileBottomNavWrapper></div>;
}
