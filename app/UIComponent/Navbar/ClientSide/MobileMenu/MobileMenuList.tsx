import React, { useState } from "react";
import DrawerMenu from "./DrawerMenu";
import MenuToggleButton from "./MenuToggleButton";
import MobileAccountMenu from "./MobileAccountMenu";

export default function MobileMenuList({ data }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MobileAccountMenu
      onClose={() => setIsOpen(false)}
      renderItem={(accountItem) =>
        isOpen ? (
          <DrawerMenu
            data={data}
            onClose={() => setIsOpen(false)}
            accountMenu={accountItem}
          />
        ) : (
          <MenuToggleButton onClick={() => setIsOpen(true)} />
        )
      }
    />
  );
}