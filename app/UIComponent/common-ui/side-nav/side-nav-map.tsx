"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import styles from "@/app/about_bes/SideNav/side.module.css";
export default function SideNavMap({
  db,
  parentPath,
}: {
  db: Object[];
  parentPath: string;
}) {
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
