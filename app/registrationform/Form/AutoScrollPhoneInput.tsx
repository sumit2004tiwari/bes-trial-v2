"use client";

import React, { useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import { useCountry } from "@/app/UIComponent/context-provider/country-provider";
import "react-phone-input-2/lib/style.css";
import "@/app/registrationform/Form/phone-input.css";

type Props = React.ComponentProps<typeof PhoneInput>;

export default function AutoScrollPhoneInput(props: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const country = useCountry();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new MutationObserver(() => {
      const list = wrapper.querySelector(".react-tel-input .country-list");
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const margin = 24;
      if (rect.bottom > window.innerHeight - margin) {
        const overflow = rect.bottom - (window.innerHeight - margin);
        scrollByAmount(list, overflow);
      }
    });

    observer.observe(wrapper, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  function scrollByAmount(el: Element, overflow: number) {
    let current = el.parentElement;
    while (current) {
      const style = getComputedStyle(current);
      const scrollable = /(auto|scroll)/.test(style.overflowY);
      if (scrollable && current.scrollHeight > current.clientHeight) {
        current.scrollTo({ top: current.scrollTop + overflow, behavior: "smooth" });
        return;
      }
      current = current.parentElement;
    }
    window.scrollTo({ top: window.scrollY + overflow, behavior: "smooth" });
  }

  return (
    <div ref={wrapperRef}>
      <PhoneInput {...props} country={country} />
    </div>
  );
}