"use client";
import React, { useEffect, useRef, useState } from "react";
export default function Countdown({
  from
}: any) {
  const [currentDate, setCurrentDate] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    second: 0,
  });
  const timerRef = useRef<NodeJS.Timeout|undefined>(undefined);
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      let currentDate = Date.now();
      let eventTime = new Date(from).getTime(); //Feb 16 , 2024 10:00:00 GMT+0530
      let difference = eventTime - currentDate ;
      difference = Math.floor(difference / 1000);

      if (difference > 0) {
        let calculateDay = 3600 * 24;
        let days = Math.floor(difference / calculateDay);
        let inSecond = difference % calculateDay;
        let inHours = Math.floor(inSecond / 3600);
        inSecond %= 3600;
        let inMinute = Math.floor(inSecond / 60);
        inSecond %= 60;

        let obj = {
          days: days,
          hours: inHours,
          minutes: inMinute,
          second: inSecond,
        };
        setCurrentDate(obj);
      } else {
        clearInterval(timerRef.current);
        setCurrentDate({
          days: 0,
          hours: 0,
          minutes: 0,
          second: 0,
        });
      }
    }, 1000);
  };
  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);
  return (
    <div className="contdown_container">
      <div className="coundown  px-[15px] py-[10px]">
        <p className="mb-2 flex w-full items-center justify-center text-center font-[family-name:var(--font-poppins)] text-[clamp(0.85rem,1.5vw,1rem)] font-bold uppercase leading-[1.4] tracking-[0.045em] animate-countdown-title-enter motion-reduce:animate-none">
          <span className="inline-block bg-[linear-gradient(110deg,#1e2e9a_0%,#222fda_38%,#75c24c_50%,#222fda_62%,#1e2e9a_100%)] bg-[length:300%_100%] bg-[position:100%_0] bg-clip-text text-transparent animate-countdown-title-interactive motion-reduce:animate-none">
            Time remains for BES Expo-2027
          </span>
        </p>
        <div className="flex gap-1">
          <div>
            {currentDate.days
              .toString()
              .padStart(Math.max(currentDate.days.toString().length, 2), "0")}
          </div>
          <div>:</div>
          <div>{currentDate.hours.toString().padStart(2, "0")}</div>
          <div>:</div>
          <div>{currentDate.minutes.toString().padStart(2, "0")}</div>
          <div>:</div>
          <div>{currentDate.second.toString().padStart(2, "0")}</div>
        </div>
      </div>
    </div>
  );
}
