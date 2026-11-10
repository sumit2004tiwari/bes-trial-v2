import MenuList from "./ClientSide/MenuList";
import navbarData from "./Utility/menudb.json";
export default function Header2() {
  return (
    <div>
      <MenuList data={navbarData} />
    </div>
  );
}
