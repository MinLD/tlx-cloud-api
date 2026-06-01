import { Router } from "express";

export const router: Router = Router();

router.get("/12", (_req, res) => {
  res.json({
    status: "ok",
    service: "tlx-cloud-api",
    timestamp: new Date().toISOString()
  });
});