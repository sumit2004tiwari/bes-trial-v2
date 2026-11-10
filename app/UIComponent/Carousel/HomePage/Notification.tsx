import { Button } from "@mui/material";
import React from "react";
import Countdown from "./Countdown";
import Link from "next/link";
import { IRegistrationServiceType } from "@/app/_shared/types";
import { HOMEPAGE } from "@/app/Utility/Constant";

export type ResourceButton = {
  label: string;
  url: string;
  target?: "_blank" | "_self";
};

export type HomeNotificationCmsConfig = {
  title?: string;
  subtitle?: string;
  venue?: string;
  theme?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  countdownStartDateTime?: string;
  resourceButtons?: ResourceButton[];
  visitorButtonText?: string;
  visitorButtonLink?: string;
  delegateButtonText?: string;
  delegateButtonLink?: string;
  notificationText?: string;
};

export default function Notification({
  currentRegistrationServiceStatus,
  cmsConfig,
}: {
  currentRegistrationServiceStatus: Record<IRegistrationServiceType, number>;
  cmsConfig?: HomeNotificationCmsConfig | null;
}) {
  if (!cmsConfig) return null;

  const delagateOrVisitorStatus =
    !!currentRegistrationServiceStatus.delegate_registration ||
    !!currentRegistrationServiceStatus.visitor_registration;
  const showRegistrationActions =
    !!currentRegistrationServiceStatus.delegate_registration ||
    !!currentRegistrationServiceStatus.visitor_registration;

  const resourceButtons = Array.isArray(cmsConfig.resourceButtons)
    ? cmsConfig.resourceButtons.filter(
        (button) => !!button?.label && !!button?.url,
      )
    : [];

  const hasAnyContent =
    !!cmsConfig.title ||
    !!cmsConfig.subtitle ||
    !!cmsConfig.venue ||
    !!cmsConfig.theme ||
    !!resourceButtons.length ||
    showRegistrationActions ||
    !!cmsConfig.countdownStartDateTime ||
    !!currentRegistrationServiceStatus?.my_space;

  if (!hasAnyContent) return null;

  return (
    <div className="flex gap-4 items-center flex-col w-full">
      {(cmsConfig.title || cmsConfig.subtitle) && (
        <React.Fragment>
          {!!cmsConfig.title && (
            <h4 className="font-bold text-4 text-white text-center ubuntu_font .conference_text conference_text emoisis_text text-8">
              {cmsConfig.title}
            </h4>
          )}
          {!!cmsConfig.subtitle && (
            <h3 className="font-bold text-2xl text-[#faac1d] text-center conference_text conference_text2 text-shadow">
              {cmsConfig.subtitle}
            </h3>
          )}
        </React.Fragment>
      )}

      {!!cmsConfig.venue && (
        <h3 className="font-bold text-md text-white bg-[#ff008499] w-fit p-3 text-center conference_text">
          {cmsConfig.venue}
        </h3>
      )}

      {!!cmsConfig.theme && (
        <div className="text-xl text-[#222fda] font-bold w-fit m-auto text-center mt-4">
          {cmsConfig.theme}
        </div>
      )}

      {!!currentRegistrationServiceStatus?.my_space && (
        <a
          className="flex"
          href="/event_conference/bes_expo/exibition/participation_fee"
        >
          <Button
            variant="contained"
            className="flex w-fit m-auto mt-4 bg-[#222fda] text-[16px] font-[500] hover:bg-[#ffffff] hover:text-[#000]"
          >
            Book Your Space
          </Button>
        </a>
      )}

      {!!resourceButtons.length && (
        <div className="flex gap-2 justify-center flex-wrap">
          {resourceButtons.map((button, index) => (
            <a
              className="flex"
              href={button.url}
              target={button.target || "_blank"}
              key={index}
            >
              <Button
                variant="contained"
                className="flex w-fit m-auto mt-4 bg-[#222fda] text-[16px] font-[500] hover:bg-[#ffffff] hover:text-[#000]"
              >
                {button.label}
              </Button>
            </a>
          ))}
        </div>
      )}
      {/* <div className="flex gap-2 justify-center">
        <a
          className="flex"
          href="https://www.besindia.com/pdf/bes_election/NOTICE%20For%20AGM%202026.pdf"
          target="_blank"
        >
          <Button
            variant="contained"
            className="flex w-fit m-auto mt-4 bg-[#222fda] text-[16px] font-[500] hover:bg-[#ffffff] hover:text-[#000]"
          >
            Notice for AGM-2026
          </Button>
        </a>
        <a
          className="flex"
          href="/document/besexpo/brochure2026.pdf"
          target="_blank"
        >
          <Button
            variant="contained"
            className="flex w-fit m-auto mt-4 bg-[#222fda] text-[16px] font-[500] hover:bg-[#ffffff] hover:text-[#000]"
          >
            Brochure
          </Button>
        </a> 
      </div>  */}

      {delagateOrVisitorStatus && (
        <div className="flex gap-2 justify-center mt-4 registration_btn_container">
          {!!currentRegistrationServiceStatus.visitor_registration && (
            <Link href={"/registrationform/visitor"} target="_self">
              <Button
                className="bg-orange-400 registration_btn"
                variant="contained"
                sx={{
                  "&:hover": { background: "orange" },
                }}
              >
                Visitor Registration
              </Button>
            </Link>
          )}

          {!!currentRegistrationServiceStatus.delegate_registration && (
            <Link
              href={"/registrationform/delegateregistration"}
              target="_self"
            >
              <Button
                variant="contained"
                className="bg-orange-400 registration_btn"
                sx={{
                  "&:hover": { background: "orange" },
                }}
              >
                Delegate Registration
              </Button>
            </Link>
          )}
        </div>
      )}

      {!!cmsConfig.countdownStartDateTime && (
        <Countdown from={cmsConfig.countdownStartDateTime} />
      )}

      <br />

      {/* <div className="flex gap-2 justify-center">
      
     
      <a
          className="flex"
          href="/pdf/bes_election/bio_data.pdf"
          target="_blank"
        >
          <Button
            variant="contained"
            className="flex w-fit m-auto mt-4 bg-[#222fda] text-[16px] font-[500] hover:bg-[#ffffff] hover:text-[#000]"
          >
           Bio-Data of contestants
          </Button>
        </a>
       
      </div> */}
    </div>
  );
}
