"use client";
import React from "react";
import styles from "../content.module.css";
import { useMediaQuery, useTheme } from "@mui/material";
import ChapterCard from "./ChapterCard";
import ChapterTable from "./ChapterTable";
export default function Content({ db }: any) {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:1200px)");

  return (
    <div
      className={
        "flex flex-col xl:max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <center>
        <h2 className="text-[24px] font-bold">Local Chapter</h2>
        <h4 className="text-[14px] font-bold">
          The Society has 12 Local Chapters
        </h4>
      </center>

      {isMobile ? (
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
          {db.map((item: any, index: number) => (
            <ChapterCard key={item.id} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <ChapterTable data={db} />
        </div>
      )}
    </div>
  );
}
