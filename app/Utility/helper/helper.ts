const { DYNAMIC_LINK } = require("@/app/general/commonPath");

export const handleGetDynamicLink = (id: any) => {
  return DYNAMIC_LINK[id];
};
