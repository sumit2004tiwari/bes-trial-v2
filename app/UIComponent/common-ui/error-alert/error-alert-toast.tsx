"use client";

import { useRouter } from "next/navigation";
import React, { CSSProperties, useEffect } from "react";
const TOAST_DURATION = 30000;
import { toast } from "react-hot-toast";
export default function ErrorAlertToast({
  msg,
  redirectTo,
}: {
  msg: string;
  redirectTo?: string | null;
}) {
  const router = useRouter();
  useEffect(() => {
    const style: CSSProperties = {
      color: "white",
      textAlign: "center",
    };
    toast.error(msg, {
      duration: TOAST_DURATION,

      style: { ...style, backgroundColor: "#d32f2f" },
    });
    if (redirectTo) router.replace("/");
  }, []);
  return null;
}
