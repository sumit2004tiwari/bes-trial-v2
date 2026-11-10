import React from "react";
export default function PleaseWaitLoader() {
  return (
    <div className="flex justify-center">
      <img
        src={"/Images/Loader/gif/svg/spinner.svg"}
        alt="Spinner"
        style={{ maxHeight: "100px" }}
      />
    </div>
  );
}
