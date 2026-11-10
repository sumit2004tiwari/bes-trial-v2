import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

export default function MenuToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      startIcon={<MenuIcon />}
      sx={{ color: "white" }}
      onClick={onClick}
    >
      Menu
    </Button>
  );
}