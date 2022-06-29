import { Router } from "express";
import filter from "/map/controllers/filter";
import listing from "/map/controllers/listing";
import tile from "/map/controllers/tile";
import errorHandler from "/map/errorHandler";

const router = Router({ mergeParams: true });

router.use("/filter", filter);
router.use("/listing", listing);
router.use("/tile", tile);
router.use(errorHandler);

export default router;
