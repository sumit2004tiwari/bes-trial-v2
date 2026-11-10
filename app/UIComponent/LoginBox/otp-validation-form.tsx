import {
  Alert,
  Box,
  Button,
  Card,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useFormStatus } from "react-dom";
import { userLoginAction } from "@/app/backend/action/action";
import toast from "react-hot-toast";
import { useAuthContext } from "../context-provider/auth-provider";

const initialState = {
  message: "",
  status: false,
  token: "",
  userData: null,
  isLogin: false,
};

const OtpVerification = ({ email, payload, onClose, onBack }: any) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [state, formAction] = useActionState(userLoginAction, initialState);
  const { pending } = useFormStatus();
  const handleOtpChange = (index: number, value: string) => {
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

  return (
    <Stack gap={2} alignItems="center">
      <Typography variant="h5">Verify OTP</Typography>
      <Typography variant="body2" color="text.secondary">
        Enter the 4-digit OTP sent to {email}
      </Typography>
      <form action={formAction}>
        <Box display="flex" gap={1}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              id={`otp-${index}`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputProps={{
                maxLength: 1,
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
        ></TextField>
        <TextField
          type="hidden"
          name="cookie-payload"
          required={true}
          value={payload}
        ></TextField>
        <Stack direction="row" gap={1}>
          <Button
            variant="contained"
            disabled={pending || otp.some((digit) => !digit)}
            onSubmit={formAction}
          >
            Verify
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
  const [state, formAction] = useActionState(userLoginAction, initialState);
  const { setUserData } = useAuthContext();

  useEffect(() => {
    if (state?.isLogin && state?.userData) setUserData(state?.userData || null);
  }, [state?.userData]);

  useEffect(() => {
    if (state?.needToVerifyUsingOtp) {
      setShowOtpVerification(true);
    }
  }, [state?.needToVerifyUsingOtp]);

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
        }
      );
      router.push("/user/profile");
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

      <Modal open={true} onClose={onClose} sx={{ display: "flex" }}>
        <Card
          sx={{
            minHeight: 200,
            minWidth: 400,
            padding: 2,
            width: "fit-content",
            maxWidth: 400,
            margin: "auto",
          }}
        >
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
            <form action={formAction}>
              <Stack gap={1} justifyContent={"center"} margin={"auto"}>
                <Box>
                  <Typography variant="h5">Member Login</Typography>
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
                  placeholder="Registered Email Id"
                  required={true}
                  type={"email"}
                  name="email"
                  onChange={(e) => setUserEmail(e.target.value)}
                />

                <TextField
                  placeholder="Password"
                  name="password"
                  type="password"
                  required={true}
                />
                <SubmitButton />
                <Button
                  sx={{ border: "1px solid blue" }}
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password
                </Button>
                <Button
                  sx={{ border: "1px solid blue" }}
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

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <>
      <Button
        variant="contained"
        style={
          pending
            ? { color: "white" }
            : {
                background: "blue",
                width: "fit-content",
                margin: "auto",
              }
        }
        type="submit"
        disabled={pending}
      >
        {pending ? "Please wait..." : "Login"}
      </Button>
    </>
  );
};
