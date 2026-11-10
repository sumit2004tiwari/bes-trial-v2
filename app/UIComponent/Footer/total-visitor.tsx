"use client";
import { getVisitorCount } from "@/app/frontend/actions/common-api";
import React, { useEffect, useState } from "react";

export default function TotalVisitor() {
  const [counter, setCounter] = useState(null);
  useEffect(() => {
    getVisitorCount().then((res) => {
      if (typeof res?.data?.count === "number") setCounter(res.data.count);
    }).catch(() => setCounter(null));
  }, []);
  if (!counter) return null;
  return (
    <h3 className="text-[#adff2f] text-lg min-w-[150px] text-center">
      Total Visitors: {counter}
    </h3>
  );
}
