"use client";

import Form from "@/app/registrationform/Form/Form";
import { Alert, Box } from "@mui/material";
import { useActionState, useEffect, useRef } from "react";
import { trackFormCompleted } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";
const initialState = {
  message: "",
  status: false,
};
export default function FormWithAction({
  formActionHandler,
  db,
  eventName = AnalyticsEvents.FEEDBACK_FORM_COMPLETED,
}: any) {
  const [state, formAction] = useActionState(formActionHandler, initialState);
  const formRef = useRef<HTMLFormElement|null>(null);
  const lastTrackedState = useRef<boolean>(false);
  const handleFormSubmit = (vistorDb: any, submitButtonRef: any) => {
    formRef.current?.submit();
  };

  useEffect(() => {
    if (state?.status && !lastTrackedState.current) {
      lastTrackedState.current = true;
      trackFormCompleted(eventName);
    } else if (!state?.status) {
      lastTrackedState.current = false;
    }
  }, [state?.status, eventName]);

  return (
    <>
      <form
        onSubmit={(e) => {
          console.log("2");
          e.preventDefault();
        }}
        ref={formRef}
        action={formAction}
      >
        <Box>
          {state?.message && (
            <Alert severity={state?.status ? "success" : "error"}>
              {state.message}
            </Alert>
          )}
        </Box>
        <Form
          db={db}
          isBypassEmailValidation={true}
          onClick={handleFormSubmit}
        />
      </form>
    </>
  );
}
