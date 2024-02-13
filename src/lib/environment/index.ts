import * as dotenv from "dotenv";

dotenv.config();

const environmentVariables: any = {
  nodeEnv: process.env.NODE_ENV,
  dbUri: process.env.DB_URI,
  host: process.env.HOST,
  dbName: process.env.DB_NAME,
  port: process.env.PORT,
  role: process.env.ROLE,
  origin: process.env.ORIGIN,
  jwtSecret: process.env.JWT_SECRET,
  mongoAtlasUser: process.env.MONGO_ATLAS_USER,
  mongoAtlasPassword: process.env.MONGO_ATLAS_PASSWORD,
  webdreiDir: process.env.WEBDREI_DIR,
  serviceName: process.env.SERVICE_NAME,
  free: process.env.FREE,
  premium: process.env.PREMIUM,
  kafkaBrokerListener: process.env.KAFKA_BROKER_LISTENER,
  gold: process.env.GOLD,
  redisURL: process.env.REDIS_URL,
  redisExpireTime: process.env.REDIS_EXPIRE_TIME,
  jwtSecretCommand: process.env.JWT_SECRET_COMMAND,
  cacheHost: process.env.CACHE_HOST,
};
export default environmentVariables;
