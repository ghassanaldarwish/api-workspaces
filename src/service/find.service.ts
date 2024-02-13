import kafka from "../lib/kafka";
import { randomUUID } from "crypto";
import jwt from "../lib/jwt";
import environment from "../lib/environment";

import redis, { createRedisModel, findRedisModel } from "../lib/redis";

import { Request } from "express";
//import utils from "../utils";
import model from "../models";

export async function findModel({ name }: { name: string }) {
  const payload = model(name);
  return payload;
}

/************* GET Route (/find/one)******************/

export async function findOne({ body, query, cookies, authorization }: any) {
  const { modelsKey, _id } = query;
  console.log("findOne { body, query, cookies, authorization }", {
    body,
    query,
    cookies,
    authorization,
  });

  const getPin = await findRedisModel(_id);
  console.log("getPin", getPin);
  if (getPin) {
    return getPin;
  } else {
    const model: any = await findModel({ name: modelsKey });
    const payload = await model.findOne(query);
    await createRedisModel(payload.id, payload);
    console.log("findOne payload", payload);

    return payload;
  }
}

/************* GET Route (/find/many)******************/

export async function findMany({ body, query, cookies, authorization }: any) {
  const { modelsKey } = query;
  const model: any = await findModel({ name: modelsKey });
  const payload: any = await model.find(query);
  return payload;
}
