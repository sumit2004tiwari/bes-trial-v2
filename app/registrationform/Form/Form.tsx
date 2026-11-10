"use client";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { isValidPhoneNumber } from "libphonenumber-js";
import styles from "./form.module.css";
import { numberValidator, emailValidator } from "@/app/Utility/validator";
import axios from "axios";
import SuccessModal from "@/app/UIComponent/Modals/SuccessModal";
import {
  showErrorToast,
  showSuccessToast,
} from "@/app/frontend/helper";
import EmailOtpLoader from "./EmailOtpLoader";
import OtpVerifyButton from "./OtpVerifyButton";
import OTP from "./otpinput";
import { ApiPayload } from "@/app/event_conference/bes_expo/exibition/participation_fee/types";
import { trackFormCompleted } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";

const AutoScrollPhoneInput = dynamic(
  () => import("./AutoScrollPhoneInput"),
  { ssr: false }
);
export default function Form({
  db,
  onClick,
  apiLink,
  currentPath,
  isBypassEmailValidation,
}: any) {
  const [visitorDb, setVisitorDb] = useState(db);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [validateError, setValidateError] = useState("");
  const [failedFields, setFailedFields] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [isDisabledOtpSendBtn, setIsDisabledOtpSendBtn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [otpInput, setOtpInput] = React.useState("");
  const handleChange = async (e: any, index: any) => {
    let value = e.target.value;
    if (isOtpSend && visitorDb[index].name === "email") return;
    if (visitorDb[index].fieldType === "number" && value) {
      let isValid = numberValidator(value);
      if (!isValid) return;
    }
    visitorDb[index].value = e.target.value;

    if (e.target.value && visitorDb[index]?.showError)
      visitorDb[index].showError = false;
    setValidateError("");
    setFailedFields([]);
    setVisitorDb([...visitorDb]);
  };
  const handlePhoneChange = (value: string, index: any) => {
    visitorDb[index].value = value;
    if (value && visitorDb[index]?.showError) visitorDb[index].showError = false;
    setValidateError("");
    setFailedFields([]);
    setVisitorDb([...visitorDb]);
  };
  const handleBlur = (item: any, index: any) => {
    if (isOtpSend && item?.name === "email") return;
    const value = (item?.value || "").trim();
    let error = "";
    if (item?.required && !value) {
      error = item?.errorMsg || "This Field is Required";
    } else if (item?.key === "email" && value && !emailValidator(value)) {
      error = "Please Enter Valid email";
    } else if (item?.fieldType === "phone" && value && !isValidPhoneNumber(value)) {
      error = "Please enter a valid mobile number";
    }
    visitorDb[index].showError = !!error;
    if (error) visitorDb[index].errorMsg = error;
    setVisitorDb([...visitorDb]);
  };
  const invalidEmailShowMessage = (item: any) => {
    item.showError = true;
    item.prevErrorMsg = item?.errorMsg;
    item.errorMsg = "Please Enter Valid email";
  };
  const handleValidate = async (e: any) => {
    setErrorMsg("");
    setValidateError("");
    setFailedFields([]);
    if (!isEmailVerified && !isBypassEmailValidation) {
      setErrorMsg("Please Verify the email");
      setValidateError("Please Verify the email to continue");
      return;
    }
    let isValidate = true;
    const failedFieldNames: string[] = [];
    for (let item of visitorDb) {
      let value = item?.value || "";
      value = value.trim();
      if (item?.required && !value) {
        isValidate = false;
        failedFieldNames.push(item?.name || item?.key || "Field");
        if (item.key == "email") {
          item.errorMsg = item.prevErrorMsg || item.errorMsg;
        }
        item.showError = true;
        continue;
      } else if (item.key === "email" && value) {
        const validEmail = emailValidator(value);
        if (!validEmail) {
          isValidate = false;
          failedFieldNames.push(item?.name || "Email");
          invalidEmailShowMessage(item);
        }
      } else if (item.fieldType === "phone" && value) {
        const validPhone = isValidPhoneNumber(value);
        if (!validPhone) {
          isValidate = false;
          failedFieldNames.push(item?.name || "Mobile");
          item.showError = true;
          item.prevErrorMsg = item?.prevErrorMsg || item?.errorMsg;
          item.errorMsg = "Please enter a valid mobile number";
        }
      }
    }
    if (isValidate) {
      setSubmit(isValidate);
      if (apiLink) {
        try {
          let finalObj: ApiPayload = {};
          for (let item of visitorDb) finalObj[item?.key] = item?.value;
          let res: any = await axios({
            method: "POST",
            url: apiLink,
            data: { ...finalObj, otp: otpInput },
          });
          const data = res?.data || {};
          if (!data?.status) {
            setSubmit(false);
            setErrorMsg(data?.message || "Something went wrong");
          } else {
            const badgeToken = data?.badgeToken;
            const thankYouToken = data?.thankYouToken;
            setSubmit(false);
            if (badgeToken) {
              setSuccessModal(false);
              triggerBadgeMail(badgeToken);
              showSuccessToast(
                "Registration successful! Your visitor badge has been sent to your email."
              );
            } else {
              setSuccessModal(true);
            }
            if (thankYouToken) triggerThankYouMail(thankYouToken);
            trackFormCompletion();
            resetForm();
          }
        } catch (e: any) {
          console.log(e);

          setErrorMsg(e?.response?.data?.message || "Something went wrong");
          setSubmit(false);
        }
      }
      typeof onClick === "function" && onClick(visitorDb, e);
    } else {
      setFailedFields([...new Set(failedFieldNames)]);
      setVisitorDb([...visitorDb]);
    }
  };
  const trackFormCompletion = () => {
    let eventName: string = AnalyticsEvents.CONTACT_FORM_SUBMIT;
    if (apiLink?.includes("visitor_registration")) {
      eventName = AnalyticsEvents.VISITOR_FORM_COMPLETED;
    } else if (apiLink?.includes("delegate_registration")) {
      eventName = AnalyticsEvents.DELEGATE_FORM_COMPLETED;
    }
    trackFormCompleted(eventName);
  };
  const triggerBadgeMail = async (token: string) => {
    const maxRetries = 3;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await axios({
          method: "POST",
          url: "/backend/api/visitor/send-badge-mail",
          data: { token },
        });
        return;
      } catch (e: any) {
        console.error(
          `Attempt ${attempt + 1}/${maxRetries + 1} failed to trigger badge mail`,
          e?.message
        );
        if (attempt === maxRetries) {
          showErrorToast(
            "Registration successful! However we couldn't email your badge right now. Please download it from the Download Badge page."
          );
        } else {
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
        }
      }
    }
  };
  const triggerThankYouMail = async (token: string) => {
    const maxRetries = 3;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await axios({
          method: "POST",
          url: "/backend/api/registration/send-thankyou-mail",
          data: { token },
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
  const resetForm = () => {
    setVisitorDb(
      visitorDb.map((item) => ({
        ...item,
        value: "",
        showError: false,
        prevErrorMsg: undefined,
      }))
    );
    setOtpInput("");
    setCurrentEmail("");
    setIsEmailVerified(false);
    setIsOtpSend(false);
    setIsDisabledOtpSendBtn(false);
    setIsDisabled(false);
    setErrorMsg("");
    setValidateError("");
    setFailedFields([]);
    setAlertMessage("");
  };
  const sendEmailOtp = async (email: any) => {
    try {
      await axios({
        method: "POST",
        url: "/backend/api/verification/email_verification/send_otp",
        data: {
          email,
          from: currentPath,
        },
      });
    } catch (e) {}
  };
  const handleSendEmailOtp = async () => {
    let isValidEmail = true;
    let value = "";
    for (let item of visitorDb) {
      if (item.key === "email") {
        value = item?.value?.trim();
        isValidEmail = emailValidator(value);
        if (!isValidEmail) {
          invalidEmailShowMessage(item);
        }
        break;
      }
    }
    if (isValidEmail) {
      setIsOtpSend(true);
      setIsDisabledOtpSendBtn(true);
      setCurrentEmail(value);
    } else {
      setVisitorDb([...visitorDb]);
    }
  };
  const handleEmailVerify = async () => {
    if (otpInput?.length < 4) {
      setAlertMessage("Please Enter the otp");
      return;
    }
    setIsDisabled(true);
    setAlertMessage("");
    try {
      let result: any = await axios({
        method: "POST",
        url: "/backend/api/verification/email_verification/verify_otp",
        data: {
          email: currentEmail,
          otp: otpInput,
        },
      });
      const data = result?.data || {};
      if (data.status) {
        setIsEmailVerified(true);
        return;
      } else {
        setAlertMessage(data?.message || "Invalid Otp");
      }
    } catch (e: any) {
      setAlertMessage(e?.response?.data?.message || "Invalid Otp");
      console.log(e);
    }
    setIsDisabled(false);
  };
  useEffect(() => {
    if (isDisabledOtpSendBtn && !isEmailVerified && currentEmail) {
      sendEmailOtp(currentEmail);
    }
  }, [isDisabledOtpSendBtn, currentEmail]);
  return (
    <React.Fragment>
      {validateError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validateError}
        </Alert>
      )}
      {failedFields.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <strong>Please fix the following field(s):</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            {failedFields.map((field, i) => (
              <li key={i}>{field}</li>
            ))}
          </ul>
        </Alert>
      )}
      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
      {visitorDb.map((item: any, key: any) => (
        <React.Fragment key={key}>
          {
            <div className={styles.boxContainer}>
              <div>
                <label>{item?.name || ""}</label>
              </div>
              <div>
                {item?.type === "select" ? (
                  <FormControl fullWidth>
                    <Select
                      error={item?.showError}
                      fullWidth
                      disabled={submit}
                      value={item?.value || " "}
                      onChange={(e) => handleChange(e, key)}
                      onBlur={() => handleBlur(item, key)}
                      name={item.key}
                    >
                      {item?.options?.map((sub_item: any, key: any) => (
                        <MenuItem key={key} value={sub_item.value}>
                          {sub_item?.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {item?.showError && (
                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {item?.errorMsg}
                      </FormHelperText>
                    )}
                  </FormControl>
                ) : item?.type === "textarea" ? (
                  <AutoSizeTextarea
                    value={item.value || ""}
                    index={key}
                    state={visitorDb}
                    dispatcher={setVisitorDb}
                    name={item.key}
                    showError={item?.showError}
                    errorMsg={item?.showError ? item?.errorMsg : ""}
                    onBlur={() => handleBlur(item, key)}
                  />
                ) : (
                  <Box>
                    {item?.fieldType === "phone" ? (
                      <Box>
                        <AutoScrollPhoneInput
                          value={(item?.value || "").replace(/\D/g, "")}
                          onChange={(value: string) =>
                            handlePhoneChange(`+${value}`, key)
                          }
                          onBlur={() => handleBlur(item, key)}
                          disabled={submit}
                          enableSearch
                          searchPlaceholder="Search country by name or code"
                          containerClass={item?.showError ? "phone-input-error" : ""}
                          inputProps={{
                            name: item.key,
                            placeholder: item?.placeholder || "Mobile Number",
                          }}
                        />
                        {item?.showError && (
                          <FormHelperText error>
                            {item?.errorMsg || ""}
                          </FormHelperText>
                        )}
                      </Box>
                    ) : item?.key === "email" ? (
                      <TextField
                        error={item?.showError}
                        fullWidth
                        disabled={submit || isEmailVerified || isOtpSend}
                        value={item?.value || ""}
                        onChange={(e) => handleChange(e, key)}
                        onBlur={() => handleBlur(item, key)}
                        helperText={item?.showError ? item?.errorMsg : ""}
                        name={item.key}
                      />
                    ) : (
                      <TextField
                        error={item?.showError}
                        fullWidth
                        disabled={submit}
                        value={item?.value || ""}
                        onChange={(e) => handleChange(e, key)}
                        onBlur={() => handleBlur(item, key)}
                        helperText={item?.showError ? item?.errorMsg : ""}
                        name={item.key}
                        placeholder={item?.placeholder || ""}
                      />
                    )}
                    {item.key === "email" &&
                      !isEmailVerified &&
                      (isDisabledOtpSendBtn && !isEmailVerified ? (
                        <Stack
                          direction={"column"}
                          alignItems={"center"}
                          marginTop={2}
                          gap={1}
                        >
                          <Stack direction={"row"} gap={1}>
                            <OTP
                              separator={" "}
                              value={otpInput}
                              disabled={isDisabled}
                              onChange={isDisabled ? () => {} : setOtpInput}
                              length={4}
                            />
                            <OtpVerifyButton
                              onClick={handleEmailVerify}
                              isLoading={isDisabled}
                              disabled={isDisabled}
                            />
                          </Stack>
                          <EmailOtpLoader
                            setIsOtpSend={setIsDisabledOtpSendBtn}
                          />
                        </Stack>
                      ) : isBypassEmailValidation ? null : (
                        <Button
                          variant="outlined"
                          onClick={handleSendEmailOtp}
                          sx={{
                            borderRadius: "10px",
                            textTransform: "none",
                            color: "#334155",
                            borderColor: "#CBD5E1",
                            mt: 0.75,
                            "&:hover": {
                              borderColor: "#2563EB",
                              color: "#2563EB",
                            },
                          }}
                        >
                          {isOtpSend ? "Resend " : "Send "}Otp
                        </Button>
                      ))}
                  </Box>
                )}
              </div>
            </div>
          }
        </React.Fragment>
      ))}
      <div className={styles.btn_container}>
          <Button
            fullWidth
            onClick={handleValidate}
            variant="contained"
            className={styles.submit_btn}
            disabled={submit}
            startIcon={
              submit ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
            sx={{
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
          {errorMsg && (
            <p
              style={{ color: submit ? "green" : "red" }}
              className="text-center"
            >
              {errorMsg}
            </p>
          )}
        </div>
      {showSuccessModal && <SuccessModal isOpen={true} />}
    </React.Fragment>
  );
}

const useStyles: { autoSizeTextarea: CSSProperties } = {
  autoSizeTextarea: {
    width: "100%",
    minWidth: "100px",
    minHeight: "150px",
    resize: "none",
    padding: "8px 12px",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  },
};
const AutoSizeTextarea = ({
  index,
  value,
  dispatcher,
  state,
  name,
  showError,
  errorMsg,
  onBlur,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const handleTextareaChange = (event: any) => {
    state[index].value = event.target.value;
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    if (event.target.value && state?.[index]?.showError)
      state[index].showError = false;
    dispatcher([...state]);
  };
  return (
    <div style={{ width: "100%" }}>
      <TextareaAutosize
        ref={textareaRef}
        style={useStyles.autoSizeTextarea}
        value={value}
        onChange={handleTextareaChange}
        onBlur={onBlur}
        name={name}
      />
      {showError && (
        <div
          style={{
            color: "#d32f2f",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          {errorMsg}
        </div>
      )}
    </div>
  );
};
