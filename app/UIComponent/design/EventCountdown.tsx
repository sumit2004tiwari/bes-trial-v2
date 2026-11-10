"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icons";
import { resourceUrl } from "./resource-url";

const units = ["Days", "Hours", "Minutes", "Seconds"];
const splitTime = (seconds: number) => [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];

export default function EventCountdown({ from, registrationHref = "/registrationform/visitor" }: { from: string; registrationHref?: string }) {
  const titleId = useId();
  const dateId = useId();
  const [time, setTime] = useState<{ current: number | null; previous: number | null }>({ current: null, previous: null });
  const target = new Date(from).getTime();
  const valid = Number.isFinite(target);
  useEffect(() => {
    const deadline = new Date(from).getTime();
    if (!Number.isFinite(deadline)) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      const current = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setTime(previous => previous.current === current ? previous : { current, previous: previous.current });
      if (current === 0 && timer) clearInterval(timer);
    };
    tick();
    if (deadline > Date.now()) timer = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", tick); };
  }, [from]);
  const values = time.current === null ? null : splitTime(time.current);
  const previousValues = time.previous === null ? null : splitTime(time.previous);
  const date = valid ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(target) : "";
  const hour = valid ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(target) : "";

  return (
    <section className="expo-countdown" aria-labelledby={titleId}>
      <div className="site-container expo-countdown-layout">
        <div className="expo-countdown-copy">
          <div className="expo-countdown-kicker"><span aria-hidden="true" />the upcoming edition</div>
          <h2 id={titleId}>Until the Next <strong>31st</strong></h2>
          <p id={dateId}>{valid ? <><time dateTime={new Date(target).toISOString()}>{date}</time><span aria-hidden="true"> · </span>{hour} IST</> : "Event dates will be announced soon."}</p>
        </div>
        <Link href={resourceUrl(registrationHref)} className="button button-gold expo-countdown-register">Register<Icon name="arrow" width={20} height={20} /></Link>
        {valid && <div className="expo-countdown-display">
          <div className="expo-countdown-units" role="timer" aria-live="off" aria-label="Time remaining until BES EXPO" aria-describedby={dateId}>
            {units.map((unit, index) => {
              const value = values ? String(values[index]).padStart(2, "0") : "--";
              const previous = previousValues ? String(previousValues[index]).padStart(2, "0") : null;
              const changed = previous !== null && previous !== value;
              return <div className="expo-countdown-unit" key={unit}>
                <div className="expo-countdown-tile">
                  {changed && <span className="expo-countdown-outgoing" key={`previous-${previous}`} aria-hidden="true">{previous}</span>}
                  <span className={changed ? "expo-countdown-number expo-countdown-incoming" : "expo-countdown-number"} key={value}>{value}</span>
                </div>
                <span className="expo-countdown-unit-label">{unit}</span>
              </div>;
            })}
          </div>
          {time.current === 0 && <p className="expo-countdown-complete" role="status">The countdown is complete. Explore the latest BES EXPO updates.</p>}
        </div>}
      </div>
    </section>
  );
}
