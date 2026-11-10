"use client";
import { Alert } from "@mui/material";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

export default function CustomToast() {
  useEffect(() => {
    toast(
      <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
        {"state.message"}
      </Alert>,
      {
        duration: 40000,
        position: "top-center",

        // Styling
        style: {},
        className: "",

        // Custom Icon

        // Change colors of success/error/loading icon

        // Aria
        ariaProps: {
        
          "aria-live": "polite",
       role:"status"
        },
      }
    );
  }, []);
  return <></>;
}
