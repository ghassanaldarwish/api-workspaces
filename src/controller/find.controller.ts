import { Request, Response } from "express";
import service from "../service";
import { StatusCodes } from "http-status-codes";

/************* GET Route (/find/one)******************/

export async function findOne(req: any, res: Response) {
  try {
    const payload = await service.find.findOne({
      query: req.query,
      cookies: req.cookies,
      body: req.body,
      authorization: { userEmail: req?.userEmail, userId: req?.userId },
    });

    res.status(StatusCodes.CREATED).json(payload);
  } catch (e: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
  }
}

/************* GET Route (/find/many)******************/

export async function findMany(req: any, res: Response) {
  try {
    const payload = await service.find.findMany({
      query: req.query,
      cookies: req.cookies,
      body: req.body,
      authorization: { userEmail: req?.userEmail, userId: req?.userId },
    });
    res.status(StatusCodes.OK).json(payload);
  } catch (e: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: e.message });
  }
}
