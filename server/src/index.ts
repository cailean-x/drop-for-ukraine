require("dotenv").config();

import express, { Application } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";
import cors from "cors";

const mount = async (app: Application) => {
  console.log(`[app] : http://localhost:${process.env.PORT}`);
  const db = await connectDatabase();

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ limit: "50mb", parameterLimit: 500000000 }));
  app.use(cookieParser(process.env.SECRET));
  app.use(compression());

  app.use(cors());

  app.get("/products/:id", function (req, res, next) {
    res.json({ msg: "This is CORS-enabled for all origins!" });
  });

  if (process.env.NODE_ENV !== "development") {
    app.use(express.static(`${__dirname}/client`));
    app.get("/*", (_req, res) => res.sendFile(`${__dirname}/client/index.html`));
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });

  server.applyMiddleware({ app, path: "/api" });
  app.listen(process.env.PORT);
};

mount(express());
