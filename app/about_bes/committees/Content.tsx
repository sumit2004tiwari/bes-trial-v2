"use client";
import React from "react";
import styles from "../content.module.css";
import { useMediaQuery } from "@mui/material";
import CommitteeCard from "./CommitteeCard";
import CommitteeTable from "./CommitteeTable";

export default function Content({ db }: any) {
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <div
      className={
        "flex flex-col m-auto p-4 " + styles.content_container
      }
      style={{ maxWidth: "100%" }}
    >
      <center>
        <h2 className="text-[26px] font-bold">Committees</h2>
      </center>

      {isMobile ? (
        <div className="mt-4 grid gap-4 grid-cols-1">
          {db.map((item: any, index: number) => (
            <CommitteeCard key={item.id} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <CommitteeTable data={db} />
        </div>
      )}
    </div>
  );
}
