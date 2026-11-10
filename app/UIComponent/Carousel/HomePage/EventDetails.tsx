import Image from "next/image";
import React from "react";

export default function EventDetails() {
  return (
    <div
      className="pb-8"
      style={{
        background:
          "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)",
      }}
    >
      <div className="w-full flex flex-col">
        <table className="w-full m-auto">
          <tbody>
            {/* <tr>
              <td colSpan={"2"}>
                <Image
                  className="w-full"
                  width={962}
                  height={377}
                  src={"/Images/EventDetails/event-2025.jpg"}
                />
              </td>
            </tr> */}
            <tr className="border-b-2">
              <td
                colSpan={2}
                className="py-[10px] bg-[#6f9a37] font-bold text-white text-center"
              >
                Enquiry: For details regarding BES EXPO, please contact
              </td>
            </tr>
            <tr>
              <td className="p-2 font-bold text-[#1e1f36] event_details_text">
                For Conference: <br />
                The Chairman Conference Committee
                <br />
                BES EXPO, 912 Surya Kiran Building
                <br />
                19 Kasturba Gandhi Marg, New Delhi-110001
                <br />
                Tel: 91-11-23316709
                <br />
                E-mail: conference@besindia.com, bes@besindia.com
              </td>
              <td className="p-2 font-bold text-[#1e1f36] event_details_text">
                For Exhibition: <br />
                The Coordinator BES EXPO
                <br />
                E-mail:  bes.artiuniyal@gmail.com  
                <br/>exhibition@besindia.com
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
