
import jwt, { type JwtPayload } from "jsonwebtoken";

const createJwtToken = (data: object): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(data, secret, {
    expiresIn: "1h",
  });

  return token;
};

const checkJwtToken = (token: string): JwtPayload | string | undefined => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const checkToken = jwt.verify(token, secret);
    return checkToken;
  } catch {
    return undefined;
  }
};

export { createJwtToken, checkJwtToken };
