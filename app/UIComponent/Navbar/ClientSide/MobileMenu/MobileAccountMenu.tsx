import { ListItemButton, ListItemText } from "@mui/material";
import React, { useState } from "react";
import LoginModal from "./LoginModal";
import ProfileDrawer from "./ProfileDrawer";
import { useAuthContext } from "../../../context-provider/auth-provider";

export default function MobileAccountMenu({
  renderItem,
  onClose,
}: {
  renderItem: (item: React.ReactNode) => React.ReactNode;
  onClose: () => void;
}) {
  const { userData, isSignIn, loaded, onLogout } = useAuthContext();
  const [openLogin, setOpenLogin] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const signedIn = loaded && isSignIn;
  const isAdmin = signedIn && userData?.role === "admin";

  const accountItem = signedIn ? (
    <ListItemButton
      onClick={() => {
        onClose();
        setOpenProfile(true);
      }}
    >
      <ListItemText primary="Profile" />
    </ListItemButton>
  ) : (
    <ListItemButton
      onClick={() => {
        onClose();
        setOpenLogin(true);
      }}
    >
      <ListItemText primary="Login / Signup" />
    </ListItemButton>
  );

  return (
    <>
      {renderItem(accountItem)}
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      <ProfileDrawer
        open={openProfile}
        isAdmin={isAdmin}
        userName={userData?.name}
        onLogout={onLogout}
        onClose={() => setOpenProfile(false)}
      />
    </>
  );
}