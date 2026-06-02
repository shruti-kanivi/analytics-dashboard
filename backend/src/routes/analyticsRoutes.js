const express = require("express");
const router = express.Router();
const controller = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

// router.get("/summary", controller.getSummary);
router.get("/trends", controller.getTrends);
router.get("/top-days", controller.getTopDays);
router.post("/seed", controller.seedData);
router.get(
  "/summary",
  authMiddleware,
  controller.getSummary
);

module.exports = router;