"use client";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { Icon } from "../design/Icons";
import { resourceUrl } from "../design/resource-url";
export default function DownloadBrochureButton({ href, label, target = "_blank" }: { href: string; label: string; target?: string }) {
  if (!href) return null;
  const url = resourceUrl(href);
  return <Link href={url} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className="brochure-float" onClick={() => trackEvent(AnalyticsEvents.BROCHURE_DOWNLOAD, { brochure_name: label?.trim(), page: window.location.pathname })}><Icon name="download" width={18} height={18} /><span>{label}</span></Link>;
}
