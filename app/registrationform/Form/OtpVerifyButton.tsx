"use client";
import { Button, CircularProgress } from "@mui/material";

export default function OtpVerifyButton({
  onClick,
  isLoading,
  disabled,
}: {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled || isLoading}
      startIcon={
        isLoading ? <CircularProgress size={18} color="inherit" /> : undefined
      }
      sx={{
        backgroundColor: "#2ecc71",
        color: "#fff",
        "&:hover": { backgroundColor: "#27ae60" },
      }}
    >
      {isLoading ? "Verifying..." : "Verify OTP"}
    </Button>
  );
}