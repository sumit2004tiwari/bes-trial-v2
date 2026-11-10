import {
  Alert,
  Box,
  Button,
  IconButton,
  Card,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordForm from "./ForgotPasswordForm";
import {
  userLoginAction,
  userOtpLoginAction,
} from "@/app/backend/action/action";
import toast from "react-hot-toast";
import { useAuthContext } from "../context-provider/auth-provider";
import { resendOtpAction } from "@/app/frontend/actions/login";
import { handleApiRequestWithToast } from "@/app/frontend/helper";
import CircularProgress from "@mui/material/CircularProgress";
import { trackFormCompleted } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { Icon } from "../design/Icons";

const initialState = {
  message: "",
  status: false,
  token: "",
  userData: null,
  isLogin: false,
};

const OTPTIMER = 300;
const OtpVerification = ({ email, payload, onClose, onBack }: any) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [state, formAction, isPending] = useActionState(
    userOtpLoginAction,
    initialState,
  );
  const [resendTimer, setResendTimer] = useState(OTPTIMER); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const isSubmitting = useRef(false);

  const handleFormAction = async (formData: FormData) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    try {
      await formAction(formData);
    } finally {
      isSubmitting.current = false;
    }
  };

  // Timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      const res = await handleApiRequestWithToast(
        resendOtpAction(payload),
        "OTP Sent successfully",
      );

      setResendTimer(OTPTIMER); // Reset timer
      setCanResend(false);
    } catch (error) {
      toast.error(error?.message || "Failed to resend OTP");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    // Handle paste - if more than 1 character, treat as paste
    if (value.length > 1) {
      const pastedValue = value.replace(/\D/g, "").slice(0, 4);
      const newOtp = [...otp];

      for (let i = 0; i < 4; i++) {
        newOtp[i] = pastedValue[i] || "";
      }

      setOtp(newOtp);

      // Focus the last filled input or the next empty one
      const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
      const focusIndex =
        nextEmptyIndex === -1 ? 3 : Math.max(0, nextEmptyIndex - 1);
      setTimeout(() => {
        const targetInput = document.getElementById(`otp-${focusIndex}`);
        targetInput?.focus();
      }, 0);

      return;
    }

    // Handle single character input
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 4);

    if (digits.length > 0) {
      const newOtp = ["", "", "", ""];
      for (let i = 0; i < Math.min(digits.length, 4); i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);

      // Focus the last filled input
      const lastFilledIndex = Math.min(digits.length - 1, 3);
      setTimeout(() => {
        const targetInput = document.getElementById(`otp-${lastFilledIndex}`);
        targetInput?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    if (state?.isLogin && state?.userData) {
      trackFormCompleted(AnalyticsEvents.LOGIN_COMPLETED, { method: "otp" });
      onClose();
    }
  }, [state?.userData]);

  useEffect(() => {
    if (state.userData && state?.isLogin) {
      toast(
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          {state.message}
        </Alert>,
        {
          duration: 4000,
          position: "top-center",
          ariaProps: {
            "aria-live": "polite",
            role: "status",
          },
        },
      );
      window.location.reload();
    }
  }, [state]);

  return (
    <Stack gap={2} alignItems="center">
      <Typography variant="h5">Verify OTP</Typography>
      <Typography variant="body2" color="text.secondary">
        {state?.message && !state.status && !state?.needToVerifyUsingOtp && (
          <Alert severity="error" variant="standard" sx={{ width: "100%" }}>
            {state.message}
          </Alert>
        )}
        Enter the 4-digit OTP sent to your email (you can paste the OTP)
      </Typography>
      <form action={handleFormAction}>
        <Box display="flex" gap={1}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              id={`otp-${index}`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              inputProps={{
                maxLength: 4, // Allow paste of multiple digits
                style: { textAlign: "center", fontSize: "1.5rem" },
              }}
              sx={{ width: 60 }}
            />
          ))}
        </Box>
        <TextField
          type="hidden"
          name="user-otp"
          required={true}
          value={otp.length === 4 ? otp.join("") : ""}
          style={{ display: "none" }}
        />
        <TextField
          type="hidden"
          name="cookie-payload"
          required={true}
          value={payload}
          style={{ display: "none" }}
        />
        <Stack direction="row" gap={1} mt={2}>
          <Button
            variant="contained"
            disabled={isPending || otp.some((digit) => !digit)}
            type="submit"
          >
            {isPending ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : (
              "Verify"
            )}
          </Button>

          <Button
            variant="outlined"
            disabled={!canResend}
            onClick={handleResendOtp}
            type="button"
          >
            {canResend ? "Resend OTP" : `Resend in ${formatTime(resendTimer)}`}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default function LoginForm({ onClose }: any) {
  const router = useRouter();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [state, formAction, isPending] = useActionState(
    userLoginAction,
    initialState,
  );
  const { setUserData } = useAuthContext();
  const isSubmitting = useRef(false);
  const loginAttemptedRef = useRef(false);

  const handleFormAction = async (formData: FormData) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    loginAttemptedRef.current = true;
    trackFormCompleted(AnalyticsEvents.LOGIN_STARTED, { method: "password" });
    try {
      await formAction(formData);
    } finally {
      isSubmitting.current = false;
    }
  };

  useEffect(() => {
    if (state?.isLogin && state?.userData) setUserData(state?.userData || null);
  }, [state?.userData]);

  useEffect(() => {
    if (state?.needToVerifyUsingOtp) {
      setShowOtpVerification(true);
    }
  }, [state?.needToVerifyUsingOtp]);

  useEffect(() => {
    if (state?.message && !state?.status && loginAttemptedRef.current) {
      trackFormCompleted(AnalyticsEvents.LOGIN_FAILED, { method: "password" });
      loginAttemptedRef.current = false;
    }
  }, [state]);

  useEffect(() => {
    if (state.userData && state?.isLogin) {
      trackFormCompleted(AnalyticsEvents.LOGIN_COMPLETED, {
        method: "password",
      });
      toast(
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          {state.message}
        </Alert>,
        {
          duration: 4000,
          position: "top-center",
          ariaProps: {
            "aria-live": "polite",
            role: "status",
          },
        },
      );
      // router.push("/user/profile");
      window.location.reload();
      onClose();
    }
  }, [state]);

  return (
    <>
      {state.status && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            {state.message}
          </Alert>
        </Snackbar>
      )}

      <Modal open={true} onClose={onClose} sx={{ display: "flex", p: 2 }}>
        <Card
          role="dialog"
          aria-modal="true"
          aria-label={showOtpVerification ? "Verify your email" : isForgotPassword ? "Reset your password" : "Member login"}
          sx={{
            minHeight: 200,
            minWidth: 0,
            padding: { xs: 3, sm: 4 },
            width: "100%",
            maxWidth: 440,
            margin: "auto",
            maxHeight: "90dvh",
            overflow: "auto",
            position: "relative",
          }}
        >
          <IconButton onClick={onClose} aria-label="Close login" sx={{ position: "absolute", right: 8, top: 8 }}><Icon name="close" /></IconButton>
          {showOtpVerification ? (
            <OtpVerification
              email={userEmail}
              payload={state.payload}
              onClose={onClose}
              onBack={() => setShowOtpVerification(false)}
            />
          ) : isForgotPassword ? (
            <ForgotPasswordForm onClose={onClose} />
          ) : (
            <form action={handleFormAction}>
              <Stack gap={2} justifyContent={"center"} margin={"auto"}>
                <Box>
                  <Typography variant="h5" id="member-login-title">Welcome back.</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, mb: 1 }}>Sign in to your BES member account.</Typography>
                </Box>
                {state?.message &&
                  !state.status &&
                  !state?.needToVerifyUsingOtp && (
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{ width: "100%" }}
                    >
                      {state.message}
                    </Alert>
                  )}
                <TextField
                  label="Email address"
                  placeholder="Registered Email Id"
                  required={true}
                  type={"email"}
                  name="email"
                  onChange={(e) => setUserEmail(e.target.value)}
                />

                <TextField
                  label="Password"
                  placeholder="Password"
                  name="password"
                  type="password"
                  required={true}
                />
                <SubmitButton pending={isPending} />
                <Button
                  variant="outlined"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    router.push("/member_signup");
                    onClose();
                  }}
                >
                  Create New Account
                </Button>
              </Stack>
            </form>
          )}
        </Card>
      </Modal>
    </>
  );
}

const SubmitButton = ({ pending }: { pending: boolean }) => {
  return (
    <Button
      variant="contained"
      type="submit"
      disabled={pending}
      sx={{
        background: "#142b45",
        width: "100%",
        margin: "auto",
        opacity: pending ? 0.6 : 1,
      }}
    >
      {pending ? (
        <CircularProgress size={22} sx={{ color: "white" }} />
      ) : (
        "Login"
      )}
    </Button>
  );
};
