import { fetchApiHub } from "./index";

export const getBesEventConfig = () => {
  return fetchApiHub("/backend/api/bes-event/config", "GET");
};

export const updateBesEventYear = (eventYear: number) => {
  return fetchApiHub("/backend/api/bes-event/config", "POST", { eventYear });
};