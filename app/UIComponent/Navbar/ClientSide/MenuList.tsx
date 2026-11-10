"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer, IconButton } from "@mui/material";
import { findActiveTopLevelItem, resolveMenuItemPath } from "../Utility/menuActive";
import MobileAccountMenu from "./MobileMenu/MobileAccountMenu";
import { Icon } from "../../design/Icons";

function MenuLinks({ items, parent, close }: { items: any[]; parent: string; close: () => void }) {
  return <>{items.filter(item => item.isActive).map(item => {
    const href = resolveMenuItemPath(item, parent);
    return item.isExpandable && item.subChildren?.length ? <div className="nav-link-group" key={item.id}><span className="nav-group-label">{item.name}</span><MenuLinks items={item.subChildren} parent={href} close={close} /></div> : <Link key={item.id} href={href} target={item.target || (item.externalLink === "document" ? "_blank" : undefined)} rel={item.target === "_blank" || item.externalLink === "document" ? "noopener noreferrer" : undefined} onClick={close}>{item.name}<Icon name="diagonal" width={14} height={14} /></Link>;
  })}</>;
}
export default function MenuList({ data }: { data: any[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<number, HTMLButtonElement>>({});
  const active = findActiveTopLevelItem(data, pathname);
  useEffect(() => { setOpen(null); setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!navRef.current?.contains(event.target as Node)) setOpen(null); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  const close = () => setOpen(null);
  return <>
    <nav className="desktop-nav" ref={navRef} aria-label="Main navigation" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) close(); }} onKeyDown={event => { if (event.key === "Escape" && open !== null) { triggerRefs.current[open]?.focus(); close(); } }}>
      {data.filter(item => item.isActive).map(item => {
        const isActive = item.id === active?.node?.id;
        if (!item.isExpandable) return <Link key={item.id} href={item.path} aria-current={isActive ? "page" : undefined} className={isActive ? "nav-active" : ""}>{item.name}</Link>;
        return <div className="nav-item" key={item.id}><button ref={element => { triggerRefs.current[item.id] = element; }} type="button" aria-expanded={open === item.id} aria-controls={`nav-panel-${item.id}`} className={isActive || open === item.id ? "nav-active" : ""} onClick={() => setOpen(open === item.id ? null : item.id)}>{item.name}<Icon name="chevron" width={13} height={13} /></button>
          {open === item.id && <div id={`nav-panel-${item.id}`} className="nav-panel"><div className="nav-panel-heading">Explore {item.name}</div><MenuLinks items={item.subChildren} parent={resolveMenuItemPath(item)} close={close} /></div>}
        </div>;
      })}
    </nav>
    <IconButton className="mobile-menu-trigger" onClick={() => setMobileOpen(true)} aria-label="Open main menu" aria-expanded={mobileOpen} sx={{ color: "white" }}><Icon name="menu" /></IconButton>
    <MobileAccountMenu onClose={() => setMobileOpen(false)} renderItem={account => <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ className: "mobile-menu-paper", sx: { width: "min(380px, 92vw)" } }}>
      <div className="mobile-menu-heading"><span>BES India</span><IconButton onClick={() => setMobileOpen(false)} aria-label="Close main menu"><Icon name="close" /></IconButton></div>
      <nav aria-label="Mobile navigation" className="mobile-navigation">{data.filter(item => item.isActive).map(item => item.isExpandable ? <details key={item.id}><summary>{item.name}<Icon name="chevron" width={16} height={16} /></summary><MenuLinks items={item.subChildren} parent={resolveMenuItemPath(item)} close={() => setMobileOpen(false)} /></details> : <Link key={item.id} href={item.path} onClick={() => setMobileOpen(false)}>{item.name}</Link>)}</nav>
      <div className="mobile-account-section">{account}</div><Link href="/about_bes/membership" className="button button-primary mobile-membership" onClick={() => setMobileOpen(false)}>Become a member<Icon name="arrow" /></Link>
    </Drawer>} />
  </>;
}
