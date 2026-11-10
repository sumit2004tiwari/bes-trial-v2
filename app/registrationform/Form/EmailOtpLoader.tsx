import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
const MAX_COUNT = 300;
export default function EmailOtpLoader({
  setIsOtpSend
}: any) {
  const [count, setCount] = useState(MAX_COUNT);
  useEffect(() => {
    let prevDate = Date.now();
    let id = setInterval(() => {
      setCount(() => {
        let remainingTime = Math.floor((Date.now() - prevDate) / 1000);
        let temp = MAX_COUNT - remainingTime;
        if (temp <= 0) {
          clearInterval(id);
          setIsOtpSend(false);
        }
        return temp;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <Typography>
      {(() => {
        let mm = Math.floor(count / 60);
        let ss = count % 60;
        return `${mm.toString().padStart(2, "0")}:${ss
          .toString()
          .padStart(2, "0")}`;
      })()}
    </Typography>
  );
}
