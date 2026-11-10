"use client";
import { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import { Icon } from "@/app/UIComponent/design/Icons";
export default function OpenImage({ open, handleClose, imagePath, data, startIndex = 0 }: { open: boolean; handleClose: () => void; imagePath: string; data: string[]; startIndex?: number }) {
  const [index, setIndex] = useState(startIndex);
  const previous = () => setIndex(value => Math.max(0, value - 1));
  const next = () => setIndex(value => Math.min(data.length - 1, value + 1));
  return <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" aria-labelledby="photo-viewer-title" PaperProps={{ className: "photo-viewer", sx: { bgcolor: "#0d1c30", color: "white", overflow: "hidden" } }} onKeyDown={event => { if (event.key === "ArrowLeft") previous(); if (event.key === "ArrowRight") next(); }}>
    <div className="photo-viewer-header"><span id="photo-viewer-title">BES event gallery</span><IconButton onClick={handleClose} aria-label="Close photograph" sx={{ color: "white" }}><Icon name="close" /></IconButton></div>
    <div className="photo-viewer-image"><img src={`${imagePath.replace(/\/$/, "")}/${data[index]}`} alt={`BES event photograph ${index + 1}`} /></div>
    <div className="photo-viewer-footer"><IconButton aria-label="Previous photograph" disabled={index === 0} onClick={previous} sx={{ color: "white", "&.Mui-disabled": { color: "#ffffff40" } }}><Icon name="arrow" style={{ transform: "rotate(180deg)" }} /></IconButton><span aria-live="polite">{index + 1} / {data.length}</span><IconButton aria-label="Next photograph" disabled={index === data.length - 1} onClick={next} sx={{ color: "white", "&.Mui-disabled": { color: "#ffffff40" } }}><Icon name="arrow" /></IconButton></div>
  </Dialog>;
}
