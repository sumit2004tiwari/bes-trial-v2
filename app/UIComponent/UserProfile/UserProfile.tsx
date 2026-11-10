"use client";
import React, { useState } from "react";
import { Button } from "@mui/material";
import UserDrawer from "./UserDrawer";
import { useAuthContext } from "../context-provider/auth-provider";
import AdminDrawer from "./admin-drawer";

export default function UserProfile({
  userName,
  role,
}: {
  userName: string;
  role: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { onLogout } = useAuthContext();
  return (
    <>
      {role === "admin" ? (
        <AdminDrawer
          onLogout={onLogout}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          userName={userName}
        />
      ) : (
        <UserDrawer
          onLogout={onLogout}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          userName={userName}
        />
      )}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
          fontFamily: 'var(--font-body), "Segoe UI", Arial, sans-serif',
          background: "#253b55",
          color: "white",
          fontWeight: 600,
          fontSize: "0.8rem",
          px: 2,
          py: 0.4,
          width: "130px",
          borderRadius: "6px",
          textTransform: "none",
          whiteSpace: "nowrap",
          minWidth: 0,
          lineHeight: 1.7,
            "&:hover": {
              background: "#36516e",
            },
          }}
        >
          Profile
        </Button>
      )}
    </>
  );
}
