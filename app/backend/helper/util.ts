export const expiryDate = (hours = 1) => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

export const sleep = (delay = 10000) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
