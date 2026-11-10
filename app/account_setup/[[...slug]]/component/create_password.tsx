"use client";
import { createNewPasswordAction } from "@/app/backend/action/action";
import { Alert, Box, Button, Card, Stack, Typography } from "@mui/material";
import { Password } from "primereact/password";
import { useState, useActionState, useEffect } from "react";
import { Divider } from "primereact/divider";
import "../../primereact-theme.min.css";
import { isValidPassword } from "@/app/helper/helper";
import { redirect } from "next/navigation";
import ErrorAlertToast from "@/app/UIComponent/common-ui/error-alert/error-alert-toast";
import SuccessToast from "@/app/UIComponent/common-ui/success-alert/success-toast";

const initialState = {
  message: "",
  status: false,
};

export default function CreateNewPassword({ slug1, slug2 }) {
  const [state, formAction, isPending] = useActionState(
    (prevState, formData) =>
      createNewPasswordAction(prevState, formData, slug1, slug2),
    initialState
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const onSubmit = (e) => {
    setErrorMsg("");
    if (!isValidPassword(password1)) {
      setErrorMsg("Your password is week, please use strong password");
      e.preventDefault();

      return;
    }
    if (password1 !== password2) {
      setErrorMsg("Password is not matched");
      e.preventDefault();
      return;
    }
  };

  if (!state?.status && state?.message && state?.hasToRedirect) {
    return <ErrorAlertToast redirectTo="/" msg={state?.message} />;
  }

  if (state?.status) {
    return (
      <SuccessToast
        show={true}
        msg={state?.message}
        redirect={"/?action=login"}
      />
    );
  }
  return (
    <div className="w-full h-full flex-1 py-20 bg-[#f2f2f2]">
      <Card
        sx={{
          minHeight: 200,
          minWidth: 0,
          maxWidth: 500,
          padding: 2,
          width: "calc(100% - 32px)",
          margin: "auto",
        }}
      >
        {state?.status ? (
          <Typography
            variant="h4"
            textAlign={"center"}
            className="text-green-700"
          >
            {state.message}
          </Typography>
        ) : (
          <form action={formAction} onSubmit={onSubmit}>
            <Stack gap={1} justifyContent={"center"} margin={"auto"}>
              <Box>
                <Typography variant="h5">Create New Password</Typography>
              </Box>
              {errorMsg && <Alert severity={"error"}>{errorMsg}</Alert>}
              <Box>
                {state?.message && (
                  <Alert severity={state?.status ? "success" : "error"}>
                    {state.message}
                  </Alert>
                )}
              </Box>

              <NewPassword state={password1} setState={setPassword1} />
              <Password
                key={1}
                value={password2}
                name="password2"
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Re-enter a password"
                toggleMask
                inputStyle={{ width: "100%" }}
                feedback={false}
                inputClassName={`${
                  password1 === password2 && password2.trim()
                    ? "border-green-500"
                    : ""
                } w-full`}
                style={{ width: "100%" }}
                className="basicPassword w-full"
                inputMode="none"
                invalid={password2.trim() ? password1 !== password2 : false}
              />

              <Button
                variant="contained"
                style={
                  isPending
                    ? { color: "white" }
                    : {
                        background: "blue",
                        width: "fit-content",
                        margin: "auto",
                      }
                }
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Submiting" : "Submit"}
              </Button>
            </Stack>
          </form>
        )}
      </Card>
    </div>
  );
}

const NewPassword = ({ state, setState }) => {
  const header = <div className="font-bold mb-3">Pick a password</div>;
  let lowerCaseRegex = /(?=.*[a-z])/;
  let upperCaseRegex = /(?=.*[A-Z])/;
  let specialCaseRegex = /[-+_!@#$%^&*.,?]/;
  let numericCharacterRegex = /(?=.*\d)/;

  const defaultColor = "text-green-300";
  const lowerCharacterClassName = lowerCaseRegex.test(state)
    ? defaultColor
    : "";
  const upperCharacterClassName = upperCaseRegex.test(state)
    ? defaultColor
    : "";
  const specialCharacterClassName = specialCaseRegex.test(state)
    ? defaultColor
    : "";
  const numericCharacterClassName = numericCharacterRegex.test(state)
    ? defaultColor
    : "";
  const minimumCharacterClassName =
    state.trim().length >= 8 ? defaultColor : "";
  const footer = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li className={lowerCharacterClassName}>At least one lowercase</li>
        <li className={upperCharacterClassName}>At least one uppercase</li>
        <li className={numericCharacterClassName}>At least one numeric</li>
        <li className={specialCharacterClassName}>
          At least one special character
        </li>
        <li className={minimumCharacterClassName}>Minimum 8 characters</li>
      </ul>
    </>
  );
  return (
    <Password
      key={1}
      value={state}
      invalid={state.trim() ? !isValidPassword(state) : false}
      inputClassName={`${
        state.trim() && isValidPassword(state) ? "border-green-500" : ""
      } w-full`}
      name="password"
      onChange={(e) => setState(e.target.value)}
      className="basicPassword w-full"
      placeholder="Enter a password"
      weakLabel="Too simple"
      mediumLabel="Average complexity"
      strongLabel="Complex password"
      toggleMask
      header={header}
      footer={footer}
    />
  );
};
