import { Router, Request, Response } from "express";
import Tile from "/map/models/tile";

const router = Router({ mergeParams: true });

router.get("/:z/:x/:y", async (
  req: Request<any, any, any, Map.Request.Query.TileGet>,
  res: Response<Map.Response.TileGet>, 
  next
) => {
  try {
    const { z, x, y } = req.params;
    const { fields } = req.query;
    const tile = await Tile.get(+z, +x, +y, fields?.split(',') ?? [])
    res.set('Content-Type', 'application/x-protobuf');
    return res.status(200).send(tile);
  } catch (error) {
    next(error);
  }
});

export default router;
