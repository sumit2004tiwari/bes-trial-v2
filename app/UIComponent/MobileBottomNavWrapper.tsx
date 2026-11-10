"use client";

import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

interface MobileBottomNavWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  disableContentClickClose?: boolean;
}

export default function MobileBottomNavWrapper({ 
  children, 
  title = "Explore Navigation", 
  subtitle = "All sections at a glance",
  disableContentClickClose = false
}: MobileBottomNavWrapperProps) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      {/* Fixed Left Center Button */}
      <div className="section-mobile-trigger">
        <button
          onClick={toggleDrawer(true)}
          className="section-navigation-button"
          aria-label="Open Navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
          <span>Sections</span>
        </button>
      </div>

      {/* Bottom Sheet */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "85vh",
            backgroundColor: "#fff",
          },
        }}
        sx={{
          display: { xs: "block", md: "none" },
          zIndex: 9999,
        }}
      >
        {/* Drag Handle Indicator */}
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-6 py-2 flex justify-between items-start bg-white z-10 shrink-0 border-b border-gray-100">
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">{title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            </div>
            <IconButton onClick={toggleDrawer(false)} size="small" aria-label="Close Navigation" sx={{ mt: -0.5, mr: -1, color: "#666" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </IconButton>
          </div>

          {/* Drawer Content */}
          <div 
            className="px-6 pb-8 pt-4 overflow-y-auto grow"
            onClick={disableContentClickClose ? undefined : toggleDrawer(false)}
          >
            {children}
          </div>
        </div>
      </Drawer>
    </>
  );
}
