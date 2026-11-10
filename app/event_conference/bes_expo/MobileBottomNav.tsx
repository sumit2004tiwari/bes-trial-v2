"use client";

import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import SideNavMap from "./SideNav/SideNavMap";
import db from "./SideNav/db.json";
import db2 from "./SideNav/db2.json";
import styles from "../../about_bes/SideNav/side.module.css";

export default function MobileBottomNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | false>("panel1");

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      {/* Fixed Left Center Button */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 z-50 md:hidden">
        <button
          onClick={toggleDrawer(true)}
          className="bg-[#faac1d] text-white w-10 h-16 rounded-r-xl shadow-xl flex items-center justify-center hover:bg-[#e0991a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#faac1d]"
          aria-label="Open Navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          >
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
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
          <div className="px-6 py-2 flex justify-between items-start bg-white z-10 shrink-0">
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Explore BES EXPO</h2>
              <p className="text-sm text-gray-500 mt-0.5">All sections at a glance</p>
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

          {/* Horizontal Tabs (Dynamic Active States) */}
          <div className="flex px-6 mt-4 gap-6 overflow-x-auto scrollbar-hide pb-2 shrink-0 border-b border-gray-100">
            <div 
              className={`flex flex-col items-center gap-1 min-w-max cursor-pointer transition-colors ${expanded === "panel1" ? "text-[#faac1d]" : "text-gray-500 hover:text-[#faac1d]"}`} 
              onClick={() => setExpanded("panel1")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-3"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/></svg>
              <span className={`text-[11px] font-semibold tracking-wide ${expanded === "panel1" ? "text-black" : ""}`}>EXHIBITION</span>
              <div className={`h-[3px] w-full rounded-t-md mt-1 ${expanded === "panel1" ? "bg-[#faac1d]" : "bg-transparent"}`}></div>
            </div>
            
            <div 
              className={`flex flex-col items-center gap-1 min-w-max cursor-pointer transition-colors ${expanded === "panel2" ? "text-[#faac1d]" : "text-gray-500 hover:text-[#faac1d]"}`} 
              onClick={() => setExpanded("panel2")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span className={`text-[11px] font-semibold tracking-wide ${expanded === "panel2" ? "text-black" : ""}`}>CONFERENCE</span>
              <div className={`h-[3px] w-full rounded-t-md mt-1 ${expanded === "panel2" ? "bg-[#faac1d]" : "bg-transparent"}`}></div>
            </div>
          </div>

          {/* Drawer Content - Accordions */}
          <div className="px-6 pb-8 pt-4 overflow-y-auto grow">
            
            <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')} elevation={0} sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid #f0f0f0' }}>
              <AccordionSummary
                expandIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
                }
                sx={{ px: 0, '& .MuiAccordionSummary-content': { my: 1.5 } }}
              >
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#faac1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-3"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/></svg>
                  <h3 className="font-bold text-[16px] text-black tracking-wider">EXHIBITION</h3>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
                <div 
                  className={`bg-[#faac1d] text-white p-4 rounded-xl ${styles.sideNav}`}
                  onClick={toggleDrawer(false)}
                >
                  <SideNavMap db={db || []} parentPath={"/event_conference/bes_expo/exibition"} />
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')} elevation={0} sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid #f0f0f0' }}>
              <AccordionSummary
                expandIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
                }
                sx={{ px: 0, '& .MuiAccordionSummary-content': { my: 1.5 } }}
              >
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#faac1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <h3 className="font-bold text-[16px] text-black tracking-wider">CONFERENCE</h3>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
                <div 
                  className={`bg-[#faac1d] text-white p-4 rounded-xl ${styles.sideNav}`}
                  onClick={toggleDrawer(false)}
                >
                  <SideNavMap db={db2 || []} parentPath={"/event_conference/bes_expo/conference"} />
                </div>
              </AccordionDetails>
            </Accordion>

          </div>
        </div>
      </Drawer>
    </>
  );
}
