import { randomInt } from "node:crypto";
import { hashPassword, comparePassword } from "./hashPassword.js";

const generateVerificationCode = (): string => {
  return randomInt(100000, 1000000).toString();
};

const hashVerificationCode = async (code: string): Promise<string> => {
  return hashPassword(code);
};

const compareVerificationCode = async (
  code: string,
  codeHash: string,
): Promise<boolean> => {
  return comparePassword(code, codeHash);
};

export {
  generateVerificationCode,
  hashVerificationCode,
  compareVerificationCode,
};