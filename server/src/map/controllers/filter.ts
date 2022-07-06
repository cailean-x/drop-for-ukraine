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

router.get("/city", async ( 
  req: Request<any, any, any, Map.Request.Query.FilterCityGet>,
  res: Response<Map.Response.FilterCityGet>, 
  next,
) => {
  try {
    const { country } = req.query;
    const cities = await Filter.getCities(country);
    return res.status(200).json(cities);
  } catch (error) {
    next(error);
  }
})

export default router;
