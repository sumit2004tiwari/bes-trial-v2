"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import TagIcon from "@mui/icons-material/Tag";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  getBesEventConfig,
  updateBesEventYear,
} from "@/app/frontend/actions/bes-event";
import { handleApiRequestWithToast } from "@/app/frontend/helper";

const yearOptions = [2025, 2026, 2027, 2028];

const getPrefix = (year: number) => `BES${String(year).slice(-2)}`;

export default function BesEventConfigUI({
  initialConfig,
}: {
  initialConfig: any;
}) {
  const [eventYear, setEventYear] = useState<number>(
    Number(initialConfig?.eventYear) || 2025
  );
  const [currentPrefix, setCurrentPrefix] = useState<string>(
    initialConfig?.prefix ||
      getPrefix(Number(initialConfig?.eventYear) || 2025)
  );
  const [savedConfig, setSavedConfig] = useState<{
    year: number;
    prefix: string;
  } | null>({
    year: Number(initialConfig?.eventYear) || 2025,
    prefix:
      initialConfig?.prefix || getPrefix(Number(initialConfig?.eventYear) || 2025),
  });
  const [pending, setPending] = useState(false);
  const [reloading, setReloading] = useState(false);

  const previewPrefix = getPrefix(eventYear);
  const isNew = !savedConfig || savedConfig.year !== eventYear;

  const handleSave = async () => {
    if (!eventYear || pending) return;
    setPending(true);
    try {
      const res = await handleApiRequestWithToast(
        updateBesEventYear(eventYear),
        `Prefix updated to ${getPrefix(eventYear)}`
      );
      if (res?.status) {
        const prefix = res?.data?.prefix || getPrefix(eventYear);
        setCurrentPrefix(prefix);
        setSavedConfig({ year: eventYear, prefix });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPending(false);
    }
  };

  const reloadConfig = async () => {
    if (reloading) return;
    setReloading(true);
    try {
      const res: any = await getBesEventConfig();
      if (res?.status) {
        const year = Number(res?.data?.config?.eventYear) || 2025;
        const prefix = res?.data?.prefix || getPrefix(year);
        setEventYear(year);
        setCurrentPrefix(prefix);
        setSavedConfig({ year, prefix });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReloading(false);
    }
  };

  return (
    <Box sx={{ p: 2, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <Typography variant="h5" sx={{ mb: 0.5, textAlign: "center" }}>
        BES Event Configuration
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        Manage the current BES expo year. URN reference number prefixes are
        derived automatically from the selected year.
      </Typography>

      <Stack sx={{ maxWidth: 720, mx: "auto" }} spacing={2}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 2, sm: 4 },
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: "1 1 200px" }}>
              <EventIcon color="primary" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Current Event Year
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {savedConfig?.year ?? eventYear}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: "1 1 180px" }}>
              <TagIcon color="primary" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Reference Prefix
                </Typography>
                <Typography variant="h6" fontWeight={600} sx={{ letterSpacing: 1 }}>
                  {currentPrefix || "BES25"}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: "1 1 160px" }}>
              <CheckCircleOutlineIcon color="success" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {savedConfig ? "Configured" : "Not Set"}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
            Select Event Year
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            The URN prefix is calculated automatically
            (e.g. 2026 &rarr; BES26). If nothing is set, the default year 2025
            (BES25) is used.
          </Typography>

          <ToggleButtonGroup
            exclusive
            fullWidth
            value={eventYear}
            onChange={(e, value) => value && setEventYear(value)}
            aria-label="event year"
            sx={{ flexWrap: "wrap" }}
          >
            {yearOptions.map((year) => (
              <ToggleButton
                key={year}
                value={year}
                sx={{
                  textTransform: "none",
                  fontSize: "0.9rem",
                  flexGrow: 1,
                  color: "text.secondary",
                }}
              >
                {year}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Preview
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    letterSpacing: 1,
                    color: isNew ? "primary.main" : "text.secondary",
                  }}
                >
                  {previewPrefix}
                </Typography>
                {isNew && (
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 600,
                    }}
                  >
                    Not saved yet
                  </Typography>
                )}
              </Box>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={reloadConfig}
                disabled={reloading || pending}
              >
                {reloading ? <CircularProgress size={18} /> : "Reload"}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={!isNew || pending}
              >
                {pending ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Save Configuration"
                )}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
}