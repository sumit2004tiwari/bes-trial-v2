"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: { main: "#142b45", dark: "#0c1d31", light: "#eaf0f5" },
    secondary: { main: "#b08a48" },
    background: { default: "#f7f8fa", paper: "#ffffff" },
    text: { primary: "#142b45", secondary: "#637183" }, divider: "#e3e8ee",
  },
  typography: { fontFamily: 'var(--font-body), "Segoe UI", Arial, sans-serif', body1: { fontSize: "1.0625rem", lineHeight: 1.75 }, body2: { fontSize: "1rem", lineHeight: 1.7 }, button: { fontSize: "1rem", textTransform: "none", fontWeight: 600 }, h5: { fontWeight: 600, letterSpacing: "-0.025em" }, h6: { fontWeight: 600 } },
  shape: { borderRadius: 5 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 4, padding: "11px 20px", minHeight: 48 } } },
    MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: "#fafbfd" }, notchedOutline: { borderColor: "#dce3ea" } } },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 16 } } },
    MuiTableCell: { styleOverrides: { root: { borderColor: "#e3e8ee", padding: "16px", fontSize: 16, lineHeight: 1.7 }, head: { background: "#f0f4f7", fontWeight: 600, color: "#142b45" } } },
    MuiAccordion: { defaultProps: { elevation: 0 }, styleOverrides: { root: { border: "1px solid #e3e8ee", "&:before": { display: "none" } } } },
    MuiDialog: { styleOverrides: { paper: { boxShadow: "0 24px 80px rgba(12,29,49,.18)" } } },
    MuiMenu: { styleOverrides: { paper: { border: "1px solid #e3e8ee", boxShadow: "0 16px 50px rgba(12,29,49,.12)" } } },
  },
});
export default function DesignProvider({ children }: { children: ReactNode }) { return <ThemeProvider theme={theme}>{children}</ThemeProvider>; }
