import jwt from "../lib/jwt";

async function authenticate(req: any, res: any, next: any) {
  const accessToken = req.headers.authorization || req.headers.Authorization;

  console.log("authenticate accessToken => ", accessToken);

  try {
    const user: any = jwt.tokenVerify(accessToken);
    req.userEmail = user.email;
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
    // throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
}

export default authenticate;
/*import CustomError from "../errors";
import utils from "../utils";
//import Token from "../models/token.model";

import environment from "../lib/environment";

const authenticate = async (req: any, res: any, next: any) => {
  const { refreshToken } = req.cookies;
  console.log("authenticate req.cookies => ", req.cookies);
  try {
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

// const authorizePermissions = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       throw new CustomError.UnauthorizedError(
//         "Unauthorized to access this route"
//       );
//     }
//     next();
//   };
// };

export default {
  authenticate,
};

/**
   if (accessToken) {
       const payload = utils.isTokenValid(accessToken);
       req.user = payload.user;
       return next();
     }
     const payload = utils.isTokenValid(refreshToken);

     const existingToken = await Token.findOne({
       user: payload.user.userId,
       refreshToken: payload.refreshToken,
     });

     if (!existingToken || !existingToken?.isValid) {
       throw new CustomError.UnauthenticatedError("Authentication Invalid");
     }

     if (environment.role !== payload.user.role) {
       res.cookie("accessToken", "", {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         signed: true,
         expires: new Date(Date.now()),
       });

       res.cookie("refreshToken", "", {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         signed: true,
         expires: new Date(Date.now()),
       });
       throw new CustomError.UnauthenticatedError("Not Allowed");
     }

     utils.attachCookiesToResponse({
       res,
       user: payload.user,
       refreshToken: existingToken.refreshToken,
     });

     req.user = payload.user;
  */
