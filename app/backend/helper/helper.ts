import { v1 as uuidv1 } from "uuid";
export const generateUniqueLink = () => {
  const options = {
    node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
    clockseq: 0x1234,
    msecs: Date.now(),
    nsecs: 5678,
  };
  return uuidv1(options);
};
