import jwt from "jsonwebtoken";
import environment from "../environment";

export const createJWT = (user: any, secret: string, expiresIn: number) => {
  const token = jwt.sign(user, secret, { expiresIn });
  return token;
};

export const tokenVerify = (token: any) =>
  jwt.verify(token, environment.jwtSecret);

export const createToken = ({ _id }: any) => {
  const oneDay = 1000 * 60 * 60 * 24;
  //const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;
  const accessTokenJWT = createJWT({ _id }, environment.jwtSecret, oneDay);
  const refreshTokenJWT = createJWT({ _id }, environment.jwtSecret, oneMonth);

  return {
    accessToken: {
      name: "access_token",
      value: accessTokenJWT,
    },
    refreshToken: {
      name: "refresh_token",
      value: refreshTokenJWT,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        maxAge: oneMonth,
      },
    },
  };
};

export default { createToken, tokenVerify };

/*

export const isTokenValid = (token: any) =>
  jwt.verify(token, environment.jwtSecret);

export const attachCookiesToResponse = ({ res, user, refreshToken }: any) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;
  console.log("attachCookiesToResponse => ", accessTokenJWT);
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};
*/
