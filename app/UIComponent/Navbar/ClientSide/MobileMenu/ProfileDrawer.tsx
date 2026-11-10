import React from "react";
import UserDrawer from "../../../UserProfile/UserDrawer";
import AdminDrawer from "../../../UserProfile/admin-drawer";

export default function ProfileDrawer({
  open,
  isAdmin,
  userName,
  onLogout,
  onClose,
}: {
  open: boolean;
  isAdmin: boolean;
  userName?: string;
  onLogout: () => void;
  onClose: () => void;
}) {
  return (
    <>
      {isAdmin ? (
        <AdminDrawer
          open={open}
          onClose={onClose}
          onLogout={onLogout}
          userName={userName}
        />
      ) : (
        <UserDrawer
          open={open}
          onClose={onClose}
          onLogout={onLogout}
          userName={userName}
        />
      )}
    </>
  );
}