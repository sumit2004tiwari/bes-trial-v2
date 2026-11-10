"use client";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect } from "react";
import toast from "react-hot-toast";

const useSuccessToast = (
  msg: string,
  redirectTo: string | null,
  show: boolean
) => {
  const router = useRouter();

  useEffect(() => {
    const style: CSSProperties = {
      color: "white",
      textAlign: "center",
    };
    if (show) {
      toast.success(msg, {
        duration: 3000,
        style: { ...style, backgroundColor: "#2e7d32" },
      });
      if (redirectTo) router.replace(redirectTo);
    }
  }, [show, redirectTo, msg]);
};

export default function SuccessToast({
  msg,
  redirect,
  show,
}: {
  msg: string;
  redirect: string | null;
  show: boolean;
}) {
  useSuccessToast(msg, redirect, show);
  return null;
}
