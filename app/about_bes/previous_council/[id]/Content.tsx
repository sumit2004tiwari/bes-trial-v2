"use client";
import React from "react";
import styles from "../../content.module.css";
import { useMediaQuery } from "@mui/material";
import CouncilMemberCard from "./CouncilMemberCard";
import CouncilMemberTable from "./CouncilMemberTable";

export default function Content({ db, council_data }: any) {
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <div
      className={
        "flex flex-col max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <center>
        <h2 className="text-[26px] font-bold">Executive Council</h2>
        <p className="text-[#003366] font-bold">
          BES Executive Council {council_data}
        </p>
      </center>

      {isMobile ? (
        <div className="mt-4 grid gap-4 grid-cols-1">
          {db.map((item: any, index: number) => (
            <CouncilMemberCard
              key={item.id}
              item={item}
              index={index}
              councilData={council_data}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <CouncilMemberTable data={db} councilData={council_data} />
        </div>
      )}
    </div>
  );
}
