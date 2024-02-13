import environment from "../lib/environment";
import kafka from "../lib/kafka";
import redis, { createRedisModel, findRedisModel } from "../lib/redis";
import slugify from "../lib/slugify";
import model, { Role } from "../models";
import axios from "axios";
import { exec } from "child_process";
import detect from "detect-port";
import Docker from "dockerode";
import fs from "fs";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const fsPromises = fs.promises;

export async function createModel({ name }: { name: string }) {
  const payload = model(name);
  return payload;
}

const writeFile = async ({ workspace }: any) => {
  const dir_name = `public/`;

  const isDir = fs.existsSync(`${dir_name}/${workspace}/`);

  if (!isDir) {
    fs.mkdirSync(`${dir_name}/${workspace}/`);
  }
};

/************* POST Route (/create/one)******************/

export async function createOne({ body, query, cookies, authorization }: any) {
  console.log(
    "createOne &&&&&&&&&&&&======>  ",
    body,
    query,
    cookies,
    authorization
  );

  const user: any = await kafka.producerMessages("users", "findOne", {
    authorization,
  });

  const { name: workspace, password, confirmPassword } = body;
  const { email, accountStatus, id, name: userName } = user;

  const slug = slugify(workspace);

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const Model = await createModel({ name: slug });
  const findModel = await Model.find();

  if (findModel.length > 0) {
    console.log("findModel => ", findModel);
    throw new Error("The workspace already exists");
  } else {
    if (accountStatus !== "pro")
      throw new Error("You have free account, please contact support");
    console.log("findModel Not found Create=> ");
    const vscodePassword = uuid();
    const workspace = new Model({
      userId: id,
      role: Role.owner,
      vscodePassword,
    });
    const payload: any = await kafka.producerMessages("users", "updateOne", {
      authorization,
      body: { workspace: slug },
      query: { email },
    });

    if (!payload) throw new Error("User not found");

    const expiresInTM = 1000 * 60 * 10;
    const token = jwt.sign(
      {
        workspaceId: workspace.id,
        workspace: slug,
        vscodePassword,
        userName,
        password,
      },
      environment.jwtSecretCommand,
      {
        expiresIn: expiresInTM,
      }
    );

    const result = await workspace.save();
    return { result, token };
  }
}

/************* POST Route (/create/many)******************/

export async function createMany({
  body,
  query,
  cookies,
  authorization,
}: any) {}
