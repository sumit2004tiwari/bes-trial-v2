import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const headerCells = [
  "Name",
  "Email",
  "Category",
  "Membership No",
  "Mobile",
  "Organization",
  "City",
  "Status",
  "Actions",
];

export default function UiLoader() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        p: { xs: 1.5, sm: 2 },
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minHeight: { xs: 560, sm: 420 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Skeleton variant="text" width={320} height={44} sx={{ maxWidth: "60%" }} />
          <Skeleton
            variant="rounded"
            width={220}
            height={40}
            sx={{ display: { xs: "none", sm: "block" } }}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              width: "100%",
              bgcolor: "#f5f5f5",
              px: 2,
              py: 1.5,
            }}
          >
            {headerCells.map((h) => (
              <Box key={h} sx={{ width: `${100 / headerCells.length}%`, pr: 2 }}>
                <Skeleton variant="text" width="70%" />
              </Box>
            ))}
          </Box>

          {Array.from({ length: 7 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                width: { xs: "100%", md: "auto" },
                display: "flex",
                px: 2,
                py: 2,
                borderBottom: i < 6 ? "1px solid" : "none",
                borderColor: "divider",
                gap: 1.5,
                "*": { width: { xs: "unset", md: `${100 / headerCells.length}%` } },
              }}
            >
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ mr: { xs: "auto", md: 1 } }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton
                    key={j}
                    variant="text"
                    width={`${70 - j * 15}%`}
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}