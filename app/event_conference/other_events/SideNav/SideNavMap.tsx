"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/about_bes/SideNav/side.module.css";

export default function SideNavMap({
  db,
  parentPath
}: any) {
  const pathname = usePathname();
  return (
    <ul className="pl-2">
      {db.filter((item: any) => item.isActive !== false).map((item: any, key: any) => {
        let temp = item?.isSeprateParentPath ? item.parentPath : parentPath;
        return (
          <li key={item.id}>
            {item?.isSeprateParentPath ? (
              <a
                href={temp + item.path}
                target={`${item?.path.endsWith(".pdf") ? "_blank" : "_self"}`}
                className={`${
                  pathname.endsWith(temp + item.path) ? styles.selected : ""
                }`}
              >
                {" "}
                {item.name}
              </a>
            ) : (
              <Link
                href={temp + item.path}
                target={`${item?.path.endsWith(".pdf") ? "_blank" : "_self"}`}
                className={`${
                  pathname.endsWith(temp + item.path) ? styles.selected : ""
                }`}
              >
                {item.name}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
