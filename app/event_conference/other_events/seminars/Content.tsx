"use client";
import styles from "@/app/about_bes/content.module.css";
import ArchiveContent from "@/app/UIComponent/design/ArchiveContent";
export default function Content({
  db,
  council_data
}: any) {
  return (
    <div
      className={
        "flex flex-col max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <div className="mt-[20px]"><ArchiveContent html={db} /></div>
    </div>
  );
}
