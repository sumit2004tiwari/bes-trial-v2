import { HOMEPAGE, NOTIFICATION_TEXT } from "@/app/Utility/Constant";
import { DYNAMIC_LINK } from "@/app/general/commonPath";
import type { HomePageContent } from "./types";

export function getStaticHomepageContent(): HomePageContent {
  const subtitle = `${HOMEPAGE.expoStartDate.date}–${HOMEPAGE.expoEndDate.date} ${HOMEPAGE.expoEndDate.displayMonth} ${HOMEPAGE.expoEndDate.year}`;
  const countdownStartDateTime = `${HOMEPAGE.expoStartDate.month} ${HOMEPAGE.expoStartDate.date} , ${HOMEPAGE.expoStartDate.year} 10:00:00 GMT+0530`;

  return {
    announcementsEnabled: !!NOTIFICATION_TEXT.isShow,
    announcementItems: (NOTIFICATION_TEXT.contents || []).map((item) => ({
      text: item.text,
      href: item.href || "",
      target: "_blank",
    })),
    brochureButton: {
      url: DYNAMIC_LINK.brochure,
      label: "Brochure",
      target: "_blank",
    },
    notificationConfig: {
      title: `BES EXPO-2027: ${HOMEPAGE.eventCount} International Conference & Exhibition on Broadcast & Media Technology`,
      subtitle,
      venue: "Hall No. 12A, Bharat Mandapam, New Delhi", // Hall No. 12A Pragati Maidan, New Delhi
      theme: "Theme: Reimagining Media: Intelligent, Innovative & Indigenous — Shaping Media for a Connected World",
      primaryButtonLink:
        "/event_conference/bes_expo/exibition/participation_fee",
      countdownStartDateTime,
      resourceButtons: [
        // {
        //   label: "Sponsorship Opportunities",
        //   url: "/pdf/others/sponsorship_opportunity.pdf",
        //   target: "_blank",
        // },
        // {
        //   label: "Brochure",
        //   url: "/document/besexpo/brochure2026.pdf",
        //   target: "_blank",
        // },
      ],
      visitorButtonText: "Visitor Registration",
      visitorButtonLink: "/registrationform/visitor",
      delegateButtonText: "Delegate Registration",
      delegateButtonLink: "/registrationform/delegateregistration",
      
    },
  };
}
