import { Router, Request, Response } from "express";
import Listing from "/map/models/listing";

const router = Router({ mergeParams: true });

router.get("/", async ( 
  req: Request<any, any, any, Map.Request.Query.ListingGet>,
  res: Response<Map.Response.ListingGet>, 
  next,
) => {
  try {
    const { country, city, type, capacity, bounds, limit, offset } = req.query;
    const filter = { country, city, type, capacity: JSON.parse(capacity ?? 'null'), bounds: JSON.parse(bounds ?? 'null') };
    const listings = await Listing.getByFilter(filter, limit ? +limit : null, offset ? +offset : null);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
})

router.post("/", async (
  req: Request<any, any, Map.Request.Body.ListingPost>,
  res: Response, 
  next,
) => {
  try {
    await Listing.insert(req.body);
    return res.status(200).end();
  } catch (error) {
    next(error);
  }
})

router.delete("/:id", async (
  req: Request,
  res: Response, 
  next,
) => {
  try {
    const { id } = req.params;
    await Listing.delete(id);
    return res.status(200).end();
  } catch (error) {
    next(error);
  }
})

router.get("/ids", async (
  req: Request<any, any, any, Map.Request.Query.ListingGet>,
  res: Response<Map.Response.ListingIdsGet>, 
  next,
) => {
  try {
    const { country, city, type, capacity, bounds, limit, offset } = req.query;
    const filter = { country, city, type, capacity: JSON.parse(capacity ?? 'null'), bounds: JSON.parse(bounds ?? 'null') };
    const ids = await Listing.getIdsByFilter(filter, limit ? +limit : null, offset ? +offset : null);
    return res.status(200).json(ids);
  } catch (error) {
    next(error);
  }
})

export default router;
