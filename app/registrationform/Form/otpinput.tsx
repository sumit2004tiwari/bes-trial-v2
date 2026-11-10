import * as React from "react";
import PropTypes from "prop-types";
import { Box, InputBase } from "@mui/material";
import { styled } from "@mui/system";

export default function OTP({
  separator,
  length,
  value,
  onChange,
  isDisabled,
}: any) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(
    new Array(length).fill(null)
  );

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const selectInput = (index: number) => {
    inputRefs.current[index]?.select();
  };

  const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case " ":
        event.preventDefault();
        break;

      case "ArrowLeft":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;

      case "ArrowRight":
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;

      case "Delete":
        event.preventDefault();
        onChange(
          (prev: string) =>
            prev.slice(0, currentIndex) + prev.slice(currentIndex + 1)
        );
        break;

      case "Backspace":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        onChange(
          (prev: string) =>
            prev.slice(0, currentIndex) + prev.slice(currentIndex + 1)
        );
        break;

      default:
        break;
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    const currentValue = event.target.value;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      if (
        inputRefs.current[indexToEnter]?.value &&
        indexToEnter < currentIndex
      ) {
        indexToEnter += 1;
      } else {
        break;
      }
    }

    onChange((prev: string) => {
      const otpArray = prev.split("");
      otpArray[indexToEnter] = currentValue[currentValue.length - 1];
      return otpArray.join("");
    });

    if (currentValue && currentIndex < length - 1) {
      focusInput(currentIndex + 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent, currentIndex: number) => {
    event.preventDefault();
    const pastedText = event.clipboardData
      .getData("text/plain")
      .substring(0, length)
      .trim();

    let indexToEnter = 0;
    while (indexToEnter <= currentIndex) {
      if (
        inputRefs.current[indexToEnter]?.value &&
        indexToEnter < currentIndex
      ) {
        indexToEnter += 1;
      } else {
        break;
      }
    }

    const otpArray = value.split("");
    for (let i = indexToEnter; i < length; i++) {
      otpArray[i] = pastedText[i - indexToEnter] ?? "";
    }

    onChange(otpArray.join(""));
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {Array.from({ length }).map((_, index) => (
        <React.Fragment key={index}>
          <StyledInput
            inputRef={(el) => (inputRefs.current[index] = el)}
            value={value[index] ?? ""}
            disabled={isDisabled}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onChange={(e) => handleChange(e as any, index)}
            onClick={() => selectInput(index)}
            onPaste={(e) => handlePaste(e, index)}
            inputProps={{
              "aria-label": `Digit ${index + 1} of OTP`,
              maxLength: 1,
            }}
          />
          {index < length - 1 && separator}
        </React.Fragment>
      ))}
    </Box>
  );
}

OTP.propTypes = {
  length: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  separator: PropTypes.node,
};

const blue = {
  200: "#80BFFF",
  400: "#3399FF",
  600: "#0072E5",
};

const grey = {
  200: "#DAE2ED",
  300: "#C7D0DD",
  700: "#434D5B",
  900: "#1C2025",
};

const StyledInput = styled(InputBase)(({ theme }) => ({
  width: 40,
  textAlign: "center",
  fontFamily: "IBM Plex Sans, sans-serif",
  fontSize: "0.875rem",
  fontWeight: 400,
  lineHeight: 1.5,
  padding: "8px 0",
  borderRadius: 8,
  color: theme.palette.mode === "dark" ? grey[300] : grey[900],
  backgroundColor: theme.palette.mode === "dark" ? grey[900] : "#fff",
  border: `1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 2px 4px rgba(0,0,0,0.5)"
      : "0px 2px 4px rgba(0,0,0,0.05)",

  "&:hover": {
    borderColor: blue[400],
  },

  "&.Mui-focused": {
    borderColor: blue[400],
    boxShadow: `0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    }`,
  },

  "& input": {
    textAlign: "center",
    padding: 0,
  },
}));
