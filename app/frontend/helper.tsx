import { toast } from "react-hot-toast";
import { Alert } from "@mui/material";
import { CSSProperties } from "react";
const TOAST_DURATION = 10000; // 10 second
export function showErrorToast(message: string = "Something went wrong") {
  toast(
    <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
      {message}
    </Alert>,
    {
      duration: 4000,
      position: "top-center",
      ariaProps: {
        "aria-live": "polite",
        role: "status",
      },
    }
  );
}

export function showSuccessToast(message: string = "Success") {
  toast(
    <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
      {message}
    </Alert>,
    {
      duration: 4000,
      position: "top-center",
      ariaProps: {
        "aria-live": "polite",
        role: "status",
      },
    }
  );
}

export const handleApiRequestWithToast = async (
  request,
  successMsg?: string,
  duration?: number
) => {
  const style: CSSProperties = {
    color: "white",
    textAlign: "center",
  };
  const response = await request;
  if (response.ok === false) {
    toast.error(response?.errorMessage, {
      duration: duration || TOAST_DURATION,
      style: { ...style, backgroundColor: "#d32f2f" },
    });
  } else if (successMsg) {
    toast.success(successMsg, {
      duration: duration || TOAST_DURATION,
      style: { ...style, backgroundColor: "#2e7d32" },
    });
  }
  return response;
};
