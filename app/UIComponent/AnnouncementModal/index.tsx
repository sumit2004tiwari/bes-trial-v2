"use client";

import React, { useEffect, useState } from "react";
import { Dialog, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SESSION_KEY = "bes_announcement_15_aug_seen";

export default function AnnouncementModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          maxWidth: 520,
          m: 2,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.30)",
        },
      }}
    >
      <Box sx={{ position: "relative", backgroundColor: "#0B1220" }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
            color: "#FFFFFF",
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            "&:hover": { backgroundColor: "rgba(15, 23, 42, 0.8)" },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          component="img"
          src="/Images/15-aug.jpg"
          alt="15 August announcement"
          draggable={false}
          sx={{
            display: "block",
            width: "100%",
            height: "auto",
            maxHeight: "85vh",
            objectFit: "contain",
          }}
        />
      </Box>
    </Dialog>
  );
}