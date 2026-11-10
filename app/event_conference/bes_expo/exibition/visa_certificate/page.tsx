import React from "react";
import Form from "./form";
import db from "./db.json";
import styles from "@/app/registrationform/Form/form.module.css";
import { Box } from "@mui/material";
export default function page() {
  return (
    <div className="flex flex-col p-4 w-full">
      <div className={styles.container2} style={{ padding: 0 }}>
        <h3 className="text-[22px] font-bold">Visa Certificate</h3>
        <p className="my-2 text-[16px">
          Exhibitors and delegates requiring visa for travel to India for the
          show may send the following details at the earliest
        </p>
      </div>
      <div className={styles.container} style={{ marginTop: "10px" }}>
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
            <h2 className="text-center font-bold text-[20px] text-red-500">
              *All fields are mandatory
            </h2>
          </div>

          <Form db={db} />
        </Box>
      </div>
    </div>
  );
}
