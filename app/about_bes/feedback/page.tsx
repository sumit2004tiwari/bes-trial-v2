import React from "react";
import db from "./db.json";
import Form from "../../registrationform/Form/Form";
import styles from "../../registrationform/Form/form.module.css";
import { Box } from "@mui/material";
import FormWithAction from "@/app/registrationform/Form/FormWithAction";
import { feedbackFormAction } from "@/app/backend/action/action";
export default function page() {
  return (
    <div className="flex flex-col p-4 w-full">
      <div className={styles.container}>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",

            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div>
            <h2 className="text-center font-bold text-[30px] text-[#142b45]">
              Feedback
            </h2>
          </div>
          <FormWithAction db={db} formActionHandler={feedbackFormAction} />
        </Box>
      </div>
    </div>
  );
}
