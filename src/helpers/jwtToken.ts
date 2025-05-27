import jwt, { JwtPayload, Secret } from "jsonwebtoken";
export const generateToken = (payload: any, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expiresIn as string as unknown as number,
  });
};

export const verifyToken = (token: string, secret: Secret) =>{
  return jwt.verify(token, secret) as JwtPayload;
}

