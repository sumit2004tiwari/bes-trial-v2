"use client";

import OTP from "@/app/registrationform/Form/otpinput";
import toast from "react-hot-toast";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const RESEND_COOLDOWN_MS = 5 * 60 * 1000;

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default function EmailVerifingBox({ token, maskedEmail, urn }: any) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendAfter, setResendAfter] = useState(0);
  const storageKey = `badgeOtpResendAt_${urn}`;

  const sendOtp = async (isResend: boolean) => {
    setIsSendingOtp(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/backend/api/resend-badge-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        const end = Date.now() + RESEND_COOLDOWN_MS;
        sessionStorage.setItem(storageKey, String(end));
        setResendAfter(RESEND_COOLDOWN_MS);
        setSuccessMsg(
          isResend
            ? "OTP has been resent to your email address"
            : "OTP has been sent to your email address"
        );
      } else {
        const err = await res.json();
        setErrorMsg(err?.message || "Failed to send OTP, please try again");
      }
    } catch (e) {
      setErrorMsg("Something went wrong, please try again");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const sendOtpRef = useRef(sendOtp);
  sendOtpRef.current = sendOtp;
  const initialSendRef = useRef(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    const now = Date.now();
    if (stored) {
      const remaining = Number(stored) - now;
      if (remaining > 0) {
        setResendAfter(remaining);
      } else {
        sessionStorage.removeItem(storageKey);
        setResendAfter(0);
      }
    } else if (!initialSendRef.current) {
      initialSendRef.current = true;
      sendOtpRef.current(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const isCoolingDown = resendAfter > 0;
  useEffect(() => {
    if (!isCoolingDown) return;
    const interval = setInterval(() => {
      const remaining =
        Number(sessionStorage.getItem(storageKey) || 0) - Date.now();
      if (remaining <= 0) {
        sessionStorage.removeItem(storageKey);
        setResendAfter(0);
      } else {
        setResendAfter(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isCoolingDown, storageKey]);

  const onSubmit = async () => {
    if (!otp.trim()) {
      setErrorMsg("Please enter the OTP");
      return;
    }
    setIsVerifying(true);
    setErrorMsg("");
    setSuccessMsg("");
    const maxRetries = 3;
    let lastError = "Something went wrong, please try again";
    try {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const res = await fetch("/backend/api/verify-and-generate-badge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp, urn: urn }),
          });
          if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${urn}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Badge downloaded successfully!", {
              duration: 4000,
            });
            router.push("/registrationform/e-badges/download-badge");
            return;
          }
          const err = await res.json();
          lastError = err?.message || "Failed to download badge";
          if (res.status === 401) {
            break;
          }
        } catch (e) {
          lastError = "Something went wrong, please try again";
        }
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
        }
      }
      setErrorMsg(lastError);
    } finally {
      setIsVerifying(false);
    }
  };

  const canResend = resendAfter <= 0 && !isSendingOtp;

  return (
    <Box
      sx={{
        maxWidth: 500,
        width: "100%",
        mx: "auto",
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.10)",
        padding: { xs: 3, sm: 5 },
      }}
    >
      <Stack gap={2.5}>
        <Stack gap={1} textAlign="center">
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#0B1220" }}
          >
            Check your inbox
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            A one-time password has been sent to{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#0B1220" }}>
              {maskedEmail}
            </Box>
          </Typography>
          <Button
            size="small"
            sx={{ textTransform: "none", color: "#2563EB", alignSelf: "center" }}
            onClick={() =>
              router.push("/registrationform/e-badges/download-badge")
            }
          >
            Not your email? Change email
          </Button>
        </Stack>
        {errorMsg && (
          <Alert
            severity="error"
            sx={{ borderRadius: "12px", alignItems: "center", textAlign: "center" }}
          >
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert
            severity="success"
            sx={{ borderRadius: "12px", alignItems: "center", textAlign: "center" }}
          >
            {successMsg}
          </Alert>
        )}
        <Stack width="fit-content" margin={"auto"}>
          <OTP
            separator={" "}
            value={otp}
            isDisabled={isVerifying}
            onChange={isVerifying ? () => {} : setOtp}
            length={4}
          />
        </Stack>
        <Button
          variant="contained"
          size="large"
          disabled={isVerifying}
          onClick={onSubmit}
          sx={{
            width: "100%",
            minHeight: 50,
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: 16,
            background: "#142b45",
            boxShadow: "0 10px 24px rgba(37, 99, 235, 0.30)",
            "&:hover": {
              background: "#244665",
            },
          }}
        >
          {isVerifying ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Download Badge"
          )}
        </Button>
        {!isSendingOtp && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Button
              variant="text"
              size="small"
              sx={{ textTransform: "none", color: "#2563EB" }}
              disabled={!canResend}
              onClick={() => sendOtp(true)}
            >
              {"Resend OTP"}
            </Button>
            {resendAfter > 0 && (
              <Typography variant="caption" color="text.secondary">
                (resend available in {formatTime(resendAfter)})
              </Typography>
            )}
          </Stack>
        )}
        <Typography
          variant="body2"
          textAlign={"center"}
          sx={{ color: "#94A3B8" }}
        >
          Didn&apos;t receive the OTP? Check your spam folder too.
        </Typography>
      </Stack>
    </Box>
  );
}
