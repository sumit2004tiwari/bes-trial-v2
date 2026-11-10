"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

import LoginForm from "../LoginBox/LoginForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LoginButton() {
  const [openLoginBox, setOpenLoginBox] = useState(false);
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (action === "login") {
      setOpenLoginBox(true);
      router.replace(pathname || "/");
    }
  }, [action, pathname, router]);

  return (
    <>
      {openLoginBox && <LoginForm onClose={() => setOpenLoginBox(false)} />}
      <Button
        onClick={() => setOpenLoginBox(true)}
        sx={{
          fontFamily: 'var(--font-body), "Segoe UI", Arial, sans-serif',
          background: "#e5c38a",
          color: "#10243b",
          fontWeight: 600,
          fontSize: "1rem",
          px: 2,
          py: 1,
          borderRadius: "3px",
          textTransform: "none",
          whiteSpace: "nowrap",
          minWidth: 0,
          lineHeight: 1.7,
          "&:hover": {
            background: "#f1d8ad",
          },
        }}
      >
        Member login
      </Button>
    </>
  );
}
