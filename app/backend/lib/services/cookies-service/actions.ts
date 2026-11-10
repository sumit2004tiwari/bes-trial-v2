"use server";

import { cookies } from "next/headers";

export const setCookie = async (key: string, value: string, options = {}) => {
  let cookie = await cookies();
  cookie.set(key, value, { ...options });
};

export const deleteCookie = async (key: string) => {
  let cookie = await cookies();
  cookie.delete(key);
};
