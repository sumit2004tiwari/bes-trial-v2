"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import styles from "./side.module.css";
export default function SideNavMap({ db, parentPath }: any) {
  const pathname = usePathname();
  return (
    <ul className="pl-2">
      {db.filter((item: any) => item.isActive !== false).map((item: any, key: any) => (
        <li key={item.id}>
          {item?.normalLink ? (
            <a
              href={parentPath + item.path}
              className={`${
                pathname == parentPath + item.path ? styles.selected : ""
              }`}
            >
              {item.name}
            </a>
          ) : item?.externalLink === "document" ? (
            <a
              href={`/${item.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                pathname == parentPath + item.path ? styles.selected : ""
              }`}
            >
              {item.name}
            </a>
          ) : (
            <Link
              href={parentPath + item.path}
              className={`${
                pathname == parentPath + item.path ? styles.selected : ""
              }`}
            >
              {item.name}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
