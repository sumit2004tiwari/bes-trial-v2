import { Suspense } from "react";
import galleryDb from "./galleriesdb.json";
import ImageRendering from "./ImageRendering";
import SelectBox from "./SelectBox";
import { getSliderImages } from "@/app/Utility/lib/file";

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ selectedValue?: string }> }) {
  const params = await searchParams;
  const selected = galleryDb.find(item => String(item.value) === params.selectedValue) || galleryDb[0];
  let images: string[] = [];
  try { images = getSliderImages(selected.folderPath) || []; } catch { images = []; }
  return <div><div className="gallery-toolbar"><div><h2>A community, captured.</h2><p>Explore moments from BES conferences and exhibitions.</p></div><Suspense fallback={<span>Loading gallery filter…</span>}><SelectBox allImagePath={galleryDb} selectedValue={selected} /></Suspense></div><ImageRendering path={selected.folderPath} allImage={images} /></div>;
}
