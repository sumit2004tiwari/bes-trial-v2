import React from "react";
import db from "../../UIComponent/Navbar/Utility/menudb.json";
import findObject from "../../Utility/findObject";
import SideNavMap from "./SideNavMap";
import styles from "./side.module.css";

export default function SideNav({ data }: { data?: any }) {
  let aboutUs = data || findObject("key", db, 1);
  let contact = findObject("key", db, 4);
  return (
    <div
      className={styles.sideNav}
    >
      <h3 className="font-bold text-[24px] text-black">{aboutUs.name}</h3>
      <SideNavMap db={aboutUs?.subChildren || []} parentPath={aboutUs.path} />
      {contact?.isActive ? (
        <>
          <h3 className="font-bold text-[20px] text-black my-4">Contact</h3>
          <SideNavMap
            db={contact?.subChildren || []}
            parentPath={"/about_bes"}
          />
        </>
      ) : null}
    </div>
  );
}
