"use client";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { signUpAction } from "@/app/backend/action/action";
import {
  Alert,
  Box,
  Button,
  Card,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/app/_shared/validation-schema";
import { z } from "zod";
import { useAuthContext } from "../context-provider/auth-provider";
import { useRouter } from "next/navigation";
import { trackFormCompleted } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";

type SignupFormType = z.infer<typeof signupSchema>;
const PREV_STATE = {
  message: "",
  status: false,
};

export default function SignupBox() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    PREV_STATE
  );

  const { isSignIn, loaded } = useAuthContext();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // validate on change
    reValidateMode: "onSubmit", // re-validate on submit as well
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormType) => {
    trackFormCompleted(AnalyticsEvents.SIGNUP_STARTED);
    startTransition(async () => {
      formAction(data);
    });
  };

  useEffect(() => {
    if (state?.status && !isPending) {
      trackFormCompleted(AnalyticsEvents.SIGNUP_COMPLETED);
      reset();
    } else if (state?.message && !state?.status && !isPending) {
      trackFormCompleted(AnalyticsEvents.SIGNUP_FAILED);
    }
  }, [state?.status, isPending]);

  useEffect(() => {
    if (loaded && isSignIn) {
      router.replace("/");
    }
  }, [loaded, isSignIn, router]);

  if (!loaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (isSignIn) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="signup-page w-full flex items-center justify-center p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <Card className="signup-card p-8" elevation={0}>
          <Stack gap={3}>
            {/* Title */}
            <Box textAlign="center">
              <Typography
                variant="h4"
                fontWeight="bold"
                className="text-gray-800"
              >
                Create Account
              </Typography>
              <Typography variant="body2" className="text-gray-500 mt-1">
                Join the BES community. Start with your account details.
              </Typography>
            </Box>

            {/* Status Message */}

            {!!state?.message && (
              <Alert
                severity={state?.status ? "success" : "error"}
                className="rounded-lg"
              >
                {state.message}
              </Alert>
            )}

            {/* Inputs */}
            <TextField
              label="First Name"
              {...register("first_name")}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Last Name"
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Email Address"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <SubmitButton pending={isPending} />
          </Stack>
        </Card>
      </form>
    </div>
  );
}

// Custom Submit Button
const SubmitButton = ({ pending }: { pending: boolean }) => {
  return (
    <Button
      variant="contained"
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
      sx={{
        background: "#142b45",
        ":hover": { background: "#244665" },
        opacity: pending ? 0.4 : 1,
      }}
    >
      {pending ? (
        <CircularProgress size={22} sx={{ color: "white" }} />
      ) : (
        "Sign Up"
      )}
    </Button>
  );
};
