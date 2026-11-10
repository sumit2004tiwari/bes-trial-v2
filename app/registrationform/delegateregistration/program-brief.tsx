import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const sessions = [
  {
    date: "29th January 2026",
    time: "10:00 AM onwards",
    items: [
      "Inaugural Function",
      "AI's Impact on Global Media Technology Perspective",
      "AI and the Future of Media: A Global Perspective on Broadcasting in the AI Era",
    ],
  },
  {
    date: "30th January 2026",
    time: "09:30 AM to 5:00 PM",
    items: [
      "Digital Radio Roadmap: Spectrum, Infrastructure and Industry Readiness",
      "Smart Mobility through Next Gen Broadcast Technologies",
      "AI in Radio for Social Change",
      "Security and Sovereignty in D2M: Building India's Trusted Broadcasting Infrastructure",
      "Virtualized & Cloud-based Broadcast Infrastructure – From CAPEX to OPEX models",
      "AI Powered Workflows: Automation in news, production, and playout",
    ],
  },
  {
    date: "31st January 2026",
    time: "09:30 AM to 5:00 PM",
    items: [
      "Drones, Robotics-Automation in Production",
      "Monetization Models in a Multi-Platform World: Subscription, advertising, and hybrid",
      "AI-driven Content Creation: Ethics, opportunities, and regulation",
      "News during disasters, conflicts and wars",
      "Upskilling media professionals for AI, cloud, and IP-based workflows",
      "Make in India, Made for the World: Opportunities in Broadcasting",
    ],
  },
];

export default function ProgramBrief() {
  return (
    <Box
      sx={{
        bg: "#FFFFFF",
        borderRadius: "20px",
        border: "1px solid #EEF2F7",
        boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
        p: { xs: 3, sm: 4 },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #16A34A, #15803D)",
            color: "#FFFFFF",
            boxShadow: "0 8px 16px rgba(22, 163, 74, 0.3)",
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: "#0B1220", letterSpacing: "-0.01em" }}
        >
          Brief Programme
        </Typography>
      </Stack>

      {sessions.map((session, index) => (
        <Box
          key={index}
          sx={{
            mb: index < sessions.length - 1 ? 3 : 0,
            "&:not(:last-of-type)": {
              borderBottom: "1px solid #EEF2F7",
              pb: 3,
            },
            "&:last-of-type": { pb: 0 },
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
            <ScheduleOutlinedIcon sx={{ fontSize: 16, color: "#16A34A" }} />
            <Typography
              sx={{ fontWeight: 700, color: "#15803D", fontSize: 14 }}
            >
              {session.date}
            </Typography>
          </Stack>
          <Typography sx={{ color: "#64748B", fontSize: 13, mb: 1.5 }}>
            {session.time}
          </Typography>
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
            {session.items.map((item, itemIndex) => (
              <Box
                component="li"
                key={itemIndex}
                sx={{ display: "flex", gap: 0.75, mb: 1 }}
              >
                <ChevronRightIcon
                  sx={{ fontSize: 16, color: "#94A3B8", mt: 0.2, flexShrink: 0 }}
                />
                <Typography
                  sx={{ color: "#334155", fontSize: 13, lineHeight: 1.55 }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}