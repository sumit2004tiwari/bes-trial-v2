"use client";
import { getVisitorDetails } from "@/app/backend/action/action";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";

import React, { FormEvent, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

const initialState = {
  message: "",
  status: false,
  isError: false,
};
export default function EmailAddressBox() {
  const router = useRouter();
  const [state, formAction] = useActionState(getVisitorDetails, initialState);
  const [forceUpdate, setForceUpdate] = React.useState(false);
  const onChange = () => {
    state.message = "";
    state.status = false;
    state.isError = false;
    setForceUpdate(!forceUpdate);
  };
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    if (!email?.trim()) {
      e.preventDefault();
    }
  };
  useEffect(() => {
    if (state.status) {
      router.push("/registrationform/e-badges/download-badge/" + state?.token);
    }
  }, [router, state.status, state?.token]);
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
      <form action={formAction} onSubmit={onSubmit}>
        <Stack gap={2.5}>
          <Stack gap={1}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#0B1220", textAlign: "center" }}
            >
              Verify your email
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748B", textAlign: "center" }}
            >
              Enter the email you used to register for the event
            </Typography>
          </Stack>
          {state?.message && !state?.status && (
            <Typography
              variant="body2"
              textAlign={"center"}
              sx={{ color: "#DC2626" }}
            >
              {state?.message}
            </Typography>
          )}
          <TextField
            onChange={onChange}
            type={"email"}
            name="email"
            size="medium"
            fullWidth
            placeholder="Enter your email address"
            error={state?.isError}
            inputProps={{ sx: { textAlign: "center" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                backgroundColor: "#F8FAFC",
                "& fieldset": { borderColor: "#E2E8F0" },
                "&:hover fieldset": { borderColor: "#94A3B8" },
                "&.Mui-focused fieldset": {
                  borderColor: "#2563EB",
                  borderWidth: 1.5,
                },
              },
            }}
          />

          <SendOtpButton />
          <Typography
            variant="body2"
            textAlign={"center"}
            sx={{ color: "#94A3B8" }}
          >
            We will send you a one time password to verify your email address
          </Typography>
        </Stack>
      </form>
    </Box>
  );
}

function SendOtpButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="contained"
      type="submit"
      size="large"
      disabled={pending}
      sx={{
        width: "100%",
        minHeight: 50,
        borderRadius: "14px",
        textTransform: "none",
        fontWeight: 700,
        fontSize: 16,
        background: "#142b45",
        boxShadow: "none",
        "&:hover": {
          background: "#244665",
        },
      }}
    >
      {pending ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
    </Button>
  );
}
