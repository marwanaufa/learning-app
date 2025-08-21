import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import deserializeToken from "../middleware/dezerializedToken";
import { routes } from "../routes";
import dotenv from "dotenv";

const createServer = () => {
  // connect DB
  dotenv.config();
  const app: Application = express();

  app.use(deserializeToken);

  // parse body request
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // cors
  app.use(cors());
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });

  routes(app);

  return app;
};

export default createServer;
