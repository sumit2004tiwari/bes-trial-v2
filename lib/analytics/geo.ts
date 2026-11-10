const GEO_COOKIE = "bes_client_geo";

export interface ClientGeo {
  country?: string;
  region?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
}

export function getClientGeo(): ClientGeo | undefined {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${GEO_COOKIE}=`));
  if (!match) return undefined;

  const value = match.split("=").slice(1).join("=");
  if (!value) return undefined;

  try {
    return JSON.parse(decodeURIComponent(value)) as ClientGeo;
  } catch {
    return undefined;
  }
}
