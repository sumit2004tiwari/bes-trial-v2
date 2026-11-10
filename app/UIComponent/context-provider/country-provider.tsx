"use client";

import React, { createContext, useContext } from "react";

const DEFAULT_COUNTRY = "in";

const CountryContext = createContext<string>(DEFAULT_COUNTRY);

export default function CountryProvider({
  children,
  country,
}: {
  children: React.ReactNode;
  country?: string;
}) {
  return (
    <CountryContext.Provider value={country || DEFAULT_COUNTRY}>
      {children}
    </CountryContext.Provider>
  );
}

export const useCountry = () => useContext(CountryContext);
