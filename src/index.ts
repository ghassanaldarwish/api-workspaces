import express, { Express } from "express";
import "express-async-errors";
import connectDB from "./lib/mongoDB";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import http from "http";
import "./lib/kafka";
import environment from "./lib/environment";
import middleware from "./middleware";
import routes from "./routes";

import cookieParser from "cookie-parser";

const app: Express = express();
const port = environment.port;
const origin = environment.origin;
app.use(cors({ origin, credentials: true }));
app.use(cookieParser(environment.jwtSecret));
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());

app.use(express.json());
app.use("/cdn", express.static("./public"));

routes(app);
app.use(middleware.notFound);
app.use(middleware.errorHandler);
const server = http.createServer(app);
server.listen(port, async () => {
  connectDB();
  console.log(`🌞🌞🌞[server]: Port: ${port}`);
});
