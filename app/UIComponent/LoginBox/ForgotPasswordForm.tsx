import { forgotPasswordAction } from "@/app/backend/action/action";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useActionState, useEffect, useState } from "react";
import { trackFormCompleted } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";

const initialState = {
  message: "",
  status: false,
};

export default function ForgotPasswordForm({ onClose }) {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialState
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (state.status && !isPending) {
      trackFormCompleted(AnalyticsEvents.FORGOT_PASSWORD_COMPLETED);
      setEmail("");
    }
  }, [state, isPending]);

  return (
    <form action={formAction}>
      <Stack gap={2} justifyContent={"center"} margin={"auto"}>
        <Box>
          <Typography variant="h5">Forgot Password</Typography>
        </Box>
        <Box style={{ maxWidth: "100%" }}>
          {state?.message && (
            <Alert severity={state?.status ? "success" : "error"}>
              {state.message}
            </Alert>
          )}
        </Box>
        <TextField
          label="Email address"
          placeholder="Registered Email Id"
          type={"email"}
          required={true}
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          style={
            isPending
              ? { color: "white" }
              : {
                  background: "#142b45",
                  width: "100%",
                  margin: "auto",
                }
          }
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Submitting" : "Submit"}
        </Button>
      </Stack>
    </form>
  );
}
