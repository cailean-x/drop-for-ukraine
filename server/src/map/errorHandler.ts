import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, _: Request, res: Response, __: NextFunction) => {
  res.set("Content-Type", "text/plain");
  if (process.env.NODE_ENV === "development") {
    if (err instanceof Error) {
      return res.status(500).send(err.message);
    }
    return res.status(500).send(err);
  }
  return res.status(500).send("Internal Server Error");
}

export default errorHandler;
