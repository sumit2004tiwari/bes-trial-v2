import db from "./db.json";
import db2 from "./db2.json";
import SideNavMap from "./SideNavMap";
import styles from "../../../about_bes/SideNav/side.module.css";

export default function SideNav() {
  return (
    <div
      className={styles.sideNav}
    >
      <h3 className="font-bold text-[20px] text-black my-4">{""}Exhibition</h3>
      <SideNavMap
        db={db || []}
        parentPath={"/event_conference/bes_expo/exibition"}
      />
      <h3 className="font-bold text-[20px] text-black my-4">{""}Conference</h3>
      <SideNavMap
        db={db2 || []}
        parentPath={"/event_conference/bes_expo/conference"}
      />
    </div>
  );
}
