import { Router, Request, Response } from "express";
import Filter from "/map/models/filter";

const router = Router({ mergeParams: true });

router.get("/", async ( 
  _: Request,
  res: Response<Map.Response.FilterGet>, 
  next,
) => {
  try {
    const filters = await Filter.get();
    return res.status(200).json(filters);
  } catch (error) {
    next(error);
  }
})

export default router;
