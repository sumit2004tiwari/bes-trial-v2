import React from "react";

import styles from "@/app/about_bes/SideNav/side.module.css";
import SideNavMap from "./side-nav-map";
interface Props {
  db: Record<string, any>[];
  parentPath: string;
  name?: string;
}
export default function MainSideNav(props: Props) {
  return (
    <div
      className={styles.sideNav}
    >
      {!!props?.name && (
        <h3 className="font-bold text-[24px] text-black">{props?.name}</h3>
      )}
      <SideNavMap {...props} />
    </div>
  );
}
