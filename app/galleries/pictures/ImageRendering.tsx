"use client";
import { useState } from "react";
import Image from "next/image";
import OpenImage from "./OpenImage";
import { Icon } from "@/app/UIComponent/design/Icons";

export default function ImageRendering({ path, allImage }: { path: string; allImage: string[]; message?: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  if (!allImage.length) return <div className="empty-state"><h2>More moments to come.</h2><p>There are no photos in this collection yet. Choose another year to explore our event archive.</p></div>;
  return <><div className="gallery-grid">{allImage.map((src, index) => <button type="button" className="gallery-tile" key={src} onClick={() => setSelected(index)} aria-label={`View event photograph ${index + 1}`}><div><Image src={`${path.replace(/\/$/, "")}/${src}`} alt={`BES event photograph ${index + 1}`} fill sizes="(max-width: 374px) 90vw, (max-width: 767px) 45vw, 30vw" priority={index < 3} /></div><span>View photograph<Icon name="diagonal" width={18} height={18} /></span></button>)}</div>{selected !== null && <OpenImage key={`${path}-${selected}`} imagePath={path} startIndex={selected} open handleClose={() => setSelected(null)} data={allImage} />}</>;
}
