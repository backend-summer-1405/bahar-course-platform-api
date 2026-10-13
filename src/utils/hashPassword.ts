
import bcrypt from "bcrypt";

const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const checkPassword = await bcrypt.compare(password, hashedPassword);
  return checkPassword;
};

export { hashPassword, comparePassword };
