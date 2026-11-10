"use client";
import { Box, Typography, Container, Stack, Button } from "@mui/material";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

import React from "react";

export default function DownloadBadgePage({ children }: any) {
  const router = useRouter();
  return (
    <Box
      sx={{
        minHeight: "70vh",
        background: "linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)",
        py: { xs: 5, md: 8 },
        px: 2,
      }}
    >
      <Container maxWidth="sm" disableGutters>
        <Stack spacing={6} alignItems="center">
          <Box sx={{ width: "100%" }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/registrationform/visitor")}
              sx={{ textTransform: "none", color: "#64748B", px: 0 }}
            >
              Back to Registration
            </Button>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 76,
                height: 76,
                mx: "auto",
                mb: 2.5,
                borderRadius: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#142b45",
                color: "#FFFFFF",
                boxShadow: "none",
              }}
            >
              <RecentActorsIcon sx={{ fontSize: 38 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#0B1220",
                letterSpacing: "-0.02em",
              }}
            >
              Download your visitor badge
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#64748B", mt: 1.5, maxWidth: 460, mx: "auto" }}
            >
              Enter your registered email, verify with a one-time password, and
              download your official event badge.
            </Typography>
          </Box>
          <Box sx={{ width: "100%" }}>{children}</Box>
        </Stack>
      </Container>
    </Box>
  );
}
