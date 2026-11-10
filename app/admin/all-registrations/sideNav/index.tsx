import db from "./db.json";
import MainSideNav from "@/app/UIComponent/common-ui/side-nav";

export default function SideNav() {
  return (
    <MainSideNav
      db={db}
      parentPath="/admin/all-registrations/"
      name="All Registrations"
    />
  );
}
