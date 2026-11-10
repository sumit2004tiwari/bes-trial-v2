import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export const jwtGenerateToken = (user: any) => {
  return jwt.sign({ user }, "add", {
    expiresIn: "24h",
  });
};

export const verifyJsonToken = (token: any) => {
  let isValid = false;
  try {
    let temp = jwt.verify(token, process.env.SECRET_KEY as string);
    isValid = !!temp;
  } catch (e) {
    console.log(e);
  }
  return isValid;
};

export const decodeJsonToken = (token: any) => {
  let verifiedToken = "";
  try {
    let obj: any = jwt.decode(token);
    verifiedToken = obj?.user?.verifiedToken || "";
  } catch (e) {
    console.log("invalid token");
  }
  if (!verifiedToken) {
    return null;
  }
  return verifiedToken;
};

export const isValidPassword = (str: any) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{8,}$/;
  return regex.test(str);
};

export const generateBcryptPassword = async (original: any, salt = 5) => {
  return bcrypt.hash(original, salt);
};

export const compareHashPassword = async (password: any, hashPassword: any) => {
  let isValid = false;
  try {
    isValid = await bcrypt.compare(password, hashPassword);
  } catch (e) {
    console.log(e);
  }
  return isValid;
};

export const isPureString = (string: any) => {
  let regex = /^[a-zA-Z\s]+$/;

  return regex.test(string);
};
