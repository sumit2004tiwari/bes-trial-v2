import React from "react";

export default function Enquiry() {
  return (
    <div className="max-w-full">
      <p>
        <strong>ENQUIRY:</strong> For details regarding{" "}
        <strong>BES EXPO</strong>, please contact
      </p>
      <div className="mt-4 flex flex-col md:flex-row gap-10">
        <div className="flex-1 min-w-0">
          <strong>For Conference:</strong>
          <div className="mt-1">
            The Chairman Conference Committe <br />
            BES EXPO, 912 Surya Kiran Building
            <br />
            19 Kasturba Gandhi Marg, New Delhi-110001
            <br /> <strong>Tel:</strong> 91-11-23316709 <br />
            <strong> E-mail:</strong>{" "}
            <a href="mailto:conference@besindia.com">
              conference@besindia.com
            </a>
            , <a href="mailto:bes@besindia.com">bes@besindia.com</a>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <strong>For Exhibition:</strong>
          <div className="mt-1">
            The Coordinator BES EXPO
            <br />
            <strong>E-mail:</strong>{" "}
            <a href="mailto:exhibition@besindia.com">
              exhibition@besindia.com
            </a>
            <br />
            <a href="mailto:bes.artiuniyal@gmail.com">
              bes.artiuniyal@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}