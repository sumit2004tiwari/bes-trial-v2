"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  FormControlLabel,
  Select,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import OTP from "@/app/registrationform/Form/otpinput";
import OtpVerifyButton from "@/app/registrationform/Form/OtpVerifyButton";
import EmailOtpLoader from "@/app/registrationform/Form/EmailOtpLoader";
import { showSuccessToast } from "@/app/frontend/helper";
import { SpaceType } from "./types";
import useSelectedSpacePrice from "@/app/frontend/hooks/useSelectedSpacePrice";
import styles from "@/app/registrationform/Form/form.module.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import dynamic from "next/dynamic";
import Link from "next/link";
import { trackFormCompleted } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";

const AutoScrollPhoneInput = dynamic(
  () => import("@/app/registrationform/Form/AutoScrollPhoneInput"),
  { ssr: false }
);
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Original email validation regex from your earlier code:
type FormData = z.infer<ReturnType<typeof validateSchema>>;

const FIELD_LABELS: Record<string, string> = {
  name: "Full Name",
  company: "Company / Organisation Name",
  email: "Email",
  mobile: "Mobile No.",
  city: "City",
  country: "Country",
  postal_address: "Postal Address",
  about_expo: "How did you hear about the expo?",
  space_type: "Space Type",
  area_required: "Area Required",
  gst_number: "GST Number",
  designation: "Designation",
};

export default function BookYourSpace({
  countryData,
  currentPath = "bookMySpace",
  spaceTypes,
}: {
  currentPath: string;
  countryData: string[];
  spaceTypes: SpaceType[];
}) {
  const [submit, setSubmit] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isDisabledOtpSendBtn, setIsDisabledOtpSendBtn] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<SpaceType>(spaceTypes[0]);
  const alertBoxRef = useRef(null);

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(
      validateSchema(
        spaceTypes.map((item) => item?.type),
        selectedSpace
      )
    ),
    mode: "onTouched",
  });

  const emailValue = watch("email");
  const currentSelectedSpace = watch("space_type");
  const areaRequired = watch("area_required");
  if (selectedSpace.type != currentSelectedSpace && currentSelectedSpace) {
    const newSpaceType =
      spaceTypes.filter(
        (spaceType) => spaceType.type === currentSelectedSpace
      )?.[0] || spaceTypes[0];
    setSelectedSpace(newSpaceType);
  }
  const isEnabled =
    isValid &&
    currentSelectedSpace &&
    areaRequired &&
    selectedSpace?.minimum_space_rquired <= areaRequired;
  const { calculatedBasePrice } = useSelectedSpacePrice({
    selectedSpace: currentSelectedSpace,
    totalArea: areaRequired,
    isEnabled: false,
    delay: 800,
  });
  // Disable editing email after OTP sent or verified
  const isEmailFieldDisabled = submit || isEmailVerified || isOtpSend;

  // Send OTP for email verification
  const sendEmailOtp = async (email: string) => {
    try {
      await axios.post(
        "/backend/api/verification/email_verification/send_otp",
        {
          email,
          from: currentPath,
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isDisabledOtpSendBtn && !isEmailVerified && currentEmail) {
      sendEmailOtp(currentEmail);
    }
  }, [isDisabledOtpSendBtn, currentEmail]);

  // Handle sending email OTP button click
  const handleSendEmailOtp = () => {
    clearErrors("email");

    if (!emailValue || !emailRegex.test(emailValue)) {
      setError("email", {
        type: "manual",
        message: "Please enter valid email",
      });
      return;
    }

    setIsOtpSend(true);
    setIsDisabledOtpSendBtn(true);
    setCurrentEmail(emailValue);
  };

  // Handle verifying OTP
  const handleEmailVerify = async () => {
    if (otpInput.length < 4) {
      setAlertMessage("Please Enter the otp");
      return;
    }
    setIsDisabled(true);
    setAlertMessage("");

    try {
      const result = await axios.post(
        "/backend/api/verification/email_verification/verify_otp",
        {
          email: currentEmail,
          otp: otpInput,
        }
      );

      if (result.data?.status) {
        setIsEmailVerified(true);
        setAlertMessage("");
      } else {
        setAlertMessage(result.data?.message || "Invalid Otp");
      }
    } catch (e: any) {
      setAlertMessage(e?.response?.data?.message || "Invalid Otp");
      console.error(e);
    }
    setIsDisabled(false);
  };

  // Form submit handler
  const onSubmit = async (formData: FormData) => {
    setAlertMessage("");
    if (!isEmailVerified) {
      setAlertMessage("Please Verify the email");
      if (alertBoxRef.current) {
        alertBoxRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setSubmit(true);
    //force build
    try {
      const res = await axios.post("/backend/api/registration/book_my_space", {
        ...formData,
        otp: otpInput,
      });

      const data = res?.data || {};

      if (!data.status) {
        setSubmit(false);
        setAlertMessage(data?.message || "Something went wrong");
      } else {
        setSubmit(false);
        showSuccessToast(
          data?.message ||
            "Your booking request has been submitted successfully!"
        );
        if (data?.thankYouToken) triggerThankYouMail(data.thankYouToken);
        trackFormCompleted(AnalyticsEvents.BOOK_YOUR_SPACE_FORM_COMPLETED);
        resetFormValues();
      }
    } catch (e: any) {
      setAlertMessage(e?.response?.data?.message || "Something went wrong");
      setSubmit(false);
    }
  };

  const triggerThankYouMail = async (token: string) => {
    const maxRetries = 3;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await axios.post("/backend/api/registration/send-thankyou-mail", {
          token,
        });
        return;
      } catch (e: any) {
        console.error(
          `Attempt ${attempt + 1}/${maxRetries + 1} failed to send thank you mail`,
          e?.message
        );
        if (attempt === maxRetries) break;
        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
      }
    }
  };

  const resetFormValues = () => {
    reset({
      name: "",
      company: "",
      designation: "",
      email: "",
      mobile: "",
      postal_address: "",
      city: "",
      country: "",
      gst_number: "",
      space_type: "",
      area_required: undefined,
      about_expo: "",
    });
    setSelectedSpace(spaceTypes[0]);
    setShowSubmitError(false);
    setIsEmailVerified(false);
    setIsDisabled(false);
    setIsOtpSend(false);
    setIsDisabledOtpSendBtn(false);
    setOtpInput("");
    setCurrentEmail("");
    setAlertMessage("");
  };

  const onSubmitFail = () => {
    setShowSubmitError(true);
    setAlertMessage("");
    if (alertBoxRef.current) {
      alertBoxRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
      setShowSubmitError(false);
    }
  }, [errors]);

  return (
    <div className="px-2 py-10">
      <div className={styles.container}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#0B1220",
              letterSpacing: "-0.02em",
            }}
          >
            Book your space
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 14, mt: 0.5 }}>
            Please submit your details in the form below and a member of from
            our team will get back to you.
          </Typography>
          <Typography sx={{ fontSize: 14, mt: 1 }}>
            <Link
              href="/event_conference/bes_expo/exibition/floor_plan"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1d4ed8", textDecoration: "underline" }}
            >
              View Floor Plan
            </Link>
          </Typography>
        </Box>

        {alertMessage || (showSubmitError && Object.keys(errors).length > 0) ? (
          <div ref={alertBoxRef}>
            {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
            {showSubmitError &&
              Object.keys(errors).filter((key) => key !== "root").length > 0 && (
                <Alert severity="error">
                  <strong>Please fix the following field(s):</strong>
                  <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                    {Object.keys(errors)
                      .filter((key) => key !== "root")
                      .map((key) => (
                        <li key={key}>{FIELD_LABELS[key] || key}</li>
                      ))}
                  </ul>
                </Alert>
              )}
          </div>
        ) : null}

      <form
        onSubmit={handleSubmit(onSubmit, onSubmitFail)}
        noValidate
        className="flex flex-col gap-6"
      >
        {/* Name */}
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Full Name *"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              variant="outlined"
            />
          )}
        />

        {/* Company */}
        <Controller
          name="company"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Company / Organisation Name *"
              error={!!errors.company}
              helperText={errors.company?.message}
              fullWidth
              variant="outlined"
            />
          )}
        />

        {/* Designation */}
        <Controller
          name="designation"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Designation"
              fullWidth
              variant="outlined"
            />
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Email *"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              variant="outlined"
              disabled={isEmailFieldDisabled}
            />
          )}
        />

        {/* Email OTP Section */}
        <div className="flex flex-row gap-2">
          {!isEmailVerified && (
            <div className="flex flex-col gap-3">
              {isDisabledOtpSendBtn && !isEmailVerified ? (
                <Stack direction={"column"} alignItems={"center"} gap={1}>
                  <Stack direction={"row"} gap={1} alignItems="center">
                    <OTP
                      separator={" "}
                      value={otpInput}
                      disabled={isDisabled}
                      onChange={isDisabled ? () => {} : setOtpInput}
                      length={4}
                    />
{isDisabled ? (
                      <OtpVerifyButton onClick={handleEmailVerify} isLoading />
                    ) : (
                      <Stack direction="row" spacing={2}>
                        <OtpVerifyButton onClick={handleEmailVerify} />
                      </Stack>
                    )}
                  </Stack>
                  <EmailOtpLoader setIsOtpSend={setIsDisabledOtpSendBtn} />
                </Stack>
              ) : (
                <Button
                  onClick={handleSendEmailOtp}
                  variant="outlined"
                  sx={{ width: 200 }}
                >
                  {isOtpSend ? "Resend " : "Send "}Otp
                </Button>
              )}
            </div>
          )}
          {isEmailFieldDisabled && (
            <Button
              variant="outlined"
              color="info"
              sx={{ maxWidth: 40, height: 40 }}
              onClick={() => {
                console.log("working");
                setIsEmailVerified(false);
                setIsDisabled(false);
                setIsOtpSend(false);
                setIsDisabledOtpSendBtn(false);
                setOtpInput("");
              }}
            >
              Edit
            </Button>
          )}
        </div>
        {/* Mobile */}
        <Controller
          name="mobile"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Box>
              <AutoScrollPhoneInput
                value={(field.value || "").replace(/\D/g, "")}
                onChange={(value: string) => field.onChange(`+${value}`)}
                onBlur={field.onBlur}
                enableSearch
                searchPlaceholder="Search country by name or code"
                containerClass={errors.mobile ? "phone-input-error" : ""}
                inputProps={{
                  name: "mobile",
                  placeholder: "Mobile Number",
                }}
              />
              {errors.mobile && (
                <FormHelperText error>{errors.mobile?.message}</FormHelperText>
              )}
            </Box>
          )}
        />

        {/* Postal Address */}
        <Controller
          name="postal_address"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Postal Address *"
              error={!!errors.postal_address}
              helperText={errors.postal_address?.message}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
            />
          )}
        />

        {/* City */}
        <Controller
          name="city"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="City *"
              error={!!errors.city}
              helperText={errors.city?.message}
              fullWidth
              variant="outlined"
            />
          )}
        />

        {/* Country */}
        {countryData?.length ? (
          <Controller
            name="country"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={countryData}
                getOptionLabel={(option) => option}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country *"
                    error={!!errors.country}
                    helperText={errors.country?.message}
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
            )}
          />
        ) : (
          <Controller
            name="country"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Country *"
                error={!!errors.country}
                helperText={errors.country?.message}
                fullWidth
                variant="outlined"
              />
            )}
          />
        )}

        {/* GST Number (Optional) */}
        <FormControl fullWidth error={!!errors.gst_number}>
          <Controller
            name="gst_number"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="GST Number (Optional)"
                fullWidth
                variant="outlined"
              />
            )}
          />
          <FormHelperText>{errors.gst_number?.message}</FormHelperText>
        </FormControl>
        {/* About Expo */}

        {/* Participant Type Radio Buttons */}
        <FormControl
          component="fieldset"
          error={!!errors.space_type}
          margin="normal"
        >
          <FormLabel component="legend">Space Type</FormLabel>
          <Controller
            name="space_type"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} row>
                {spaceTypes?.map((item) => {
                  return (
                    <FormControlLabel
                      value={item?.type}
                      control={<Radio />}
                      label={item?.name}
                      key={item?.type}
                    />
                  );
                })}
              </RadioGroup>
            )}
          />
          <FormHelperText>{errors.space_type?.message}</FormHelperText>
        </FormControl>
        <Typography sx={{ fontSize: 14, mt: 1 }}>
          <Link
            href="/event_conference/bes_expo/exibition/floor_plan"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1d4ed8", textDecoration: "underline" }}
          >
            View Floor Plan
          </Link>
        </Typography>
        {currentSelectedSpace && (
          <Stack gap={0}>
            <Controller
              name="area_required"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter Area In Sqm"
                  error={!!errors.area_required}
                  helperText={errors.area_required?.message}
                  fullWidth
                  variant="outlined"
                  disabled={!currentSelectedSpace}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      field.onChange(value);
                    }
                  }}
                />
              )}
            />
            <Typography component="p" fontSize={12}>
              In Sqm
            </Typography>
          </Stack>
        )}
        {!!isEnabled && !!calculatedBasePrice && (
          <Typography component="p" fontSize={14} color={"green"}>
            You have to Pay {calculatedBasePrice} excluding gst
          </Typography>
        )}
        <Controller
          name="about_expo"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.about_expo}>
              <Select {...field} displayEmpty>
                <MenuItem value="">Select an option</MenuItem>
                <MenuItem value={"Google"}>Google</MenuItem>
                <MenuItem value={"LinkedIn"}>LinkedIn</MenuItem>
                <MenuItem value={"Facebook"}>Facebook</MenuItem>
                <MenuItem value={"Twitter"}>Twitter</MenuItem>
                <MenuItem value={"Instagram"}>Instagram</MenuItem>
                <MenuItem value={"Emailer"}>Emailer</MenuItem>
                <MenuItem value={"Newspaper Ads"}>Newspaper Ads</MenuItem>
                <MenuItem value={"Magazine Ads"}>Magazine Ads</MenuItem>
                <MenuItem value={"Referral from friend / colleague"}>
                  Referral from friend / colleague
                </MenuItem>
                <MenuItem value={"Whatsapp / SMS"}>Whatsapp / SMS</MenuItem>
                <MenuItem value={"Others"}>Others</MenuItem>
              </Select>
              <FormHelperText>{errors.about_expo?.message}</FormHelperText>
            </FormControl>
          )}
        />
        {/* Submit button */}
        <Button
          variant="contained"
          type="submit"
          disabled={submit}
          className={styles.submit_btn}
          startIcon={
            submit ? <CircularProgress size={18} color="inherit" /> : undefined
          }
          sx={{
            mt: 2,
            "&.Mui-disabled": {
              color: "#FFFFFF",
              opacity: 1,
              background:
                "#244665 !important",
              boxShadow: "0 8px 18px rgba(37, 99, 235, 0.25)",
            },
          }}
        >
          {submit ? "Submitting..." : "Submit"}
        </Button>
      </form>
      </div>
    </div>
  );
}

const validateSchema = (space_type, selectedSpace: SpaceType) => {
  const schema = z.object({
    name: z.string().min(1, "This Field is Required"),
    company: z.string().min(1, "This Field is Required"),
    designation: z.string().optional(),
    email: z
      .string()
      .min(1, "This Field is Required")
      .regex(emailRegex, "Please provide valid email"),
    mobile: z
      .string()
      .min(1, "This Field is Required")
      .refine((val) => isValidPhoneNumber(val), "Please provide valid mobile"),
    city: z.string().min(1, "This Field is Required"),
    country: z.string().min(1, "This Field is Required"),
    about_expo: z.string().min(1, "This Field is Required"),

    gst_number: z
      .union([
        z.literal(""),
        z.string().length(15, "GST number must be exactly 15 characters"),
      ])
      .optional(),
    postal_address: z.string().min(1, "This Field is Required"),

    space_type: z
      .string({ required_error: "This Field is Required" })
      .min(1, "This Field is Required")
      .refine((val) => space_type.includes(val), {
        message: "Invalid space type selected",
      }),
    area_required: z.coerce
      .number({ invalid_type_error: "This field must be a number" })
      .min(
        selectedSpace.minimum_space_rquired,
        `Minimum area required is ${selectedSpace.minimum_space_rquired} sqm.`
      ),
  });

  return schema;
};
