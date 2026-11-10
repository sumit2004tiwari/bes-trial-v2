import { fetchApiHub } from "..";

export const getVisitorCount = () => {
  return fetchApiHub("/backend/api/track-visitor", "GET");
};
