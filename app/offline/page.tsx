"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Typography, Button, Chip } from "@mui/material";
import WifiOffIcon from "@mui/icons-material/WifiOff";

interface CachedPage {
  url: string;
  title: string;
}

export default function OfflinePage() {
  const [cachedPages, setCachedPages] = useState<CachedPage[]>([]);

  useEffect(() => {
    const pages: CachedPage[] = [
      { url: "/", title: "Home" },
      { url: "/about_bes/at_glance", title: "About BES" },
      { url: "/event_conference/bes_expo/exibition/venue", title: "Venue" },
      { url: "/event_conference/bes_expo/conference/conference_schedule", title: "Conference Schedule" },
      { url: "/galleries/pictures", title: "Gallery" },
      { url: "/about_bes/contact_us", title: "Contact Us" },
    ];
    setCachedPages(pages);
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-4">
      <Box className="text-center bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="mb-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#fff3e0] flex items-center justify-center">
            <WifiOffIcon sx={{ fontSize: 40, color: "#ff9800" }} />
          </div>
        </div>

        <Typography variant="h5" fontWeight={700} mb={1}>
          You&apos;re Offline
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          It looks like you&apos;ve lost your internet connection. You can still
          visit pages you&apos;ve viewed before.
        </Typography>

        <Box mb={3}>
          <Chip
            label="Cached pages available"
            size="small"
            color="warning"
            variant="outlined"
          />
        </Box>

        {cachedPages.length > 0 && (
          <Box mb={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={1}
              fontWeight={600}
            >
              Try visiting:
            </Typography>
            <div className="grid grid-cols-2 gap-2">
              {cachedPages.map((page) => (
                <Link key={page.url} href={page.url}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      borderColor: "#e0e0e0",
                      color: "#616161",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#75c24c",
                        color: "#75c24c",
                        bgcolor: "#f1f8e9",
                      },
                    }}
                  >
                    {page.title}
                  </Button>
                </Link>
              ))}
            </div>
          </Box>
        )}

        <Link href="/">
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#75c24c",
              "&:hover": { bgcolor: "#5fa83a" },
            }}
          >
            Try Again
          </Button>
        </Link>

        <Typography variant="caption" color="text.disabled" display="block" mt={2}>
          Once you&apos;re back online, the page will reload automatically
        </Typography>
      </Box>
    </div>
  );
}
