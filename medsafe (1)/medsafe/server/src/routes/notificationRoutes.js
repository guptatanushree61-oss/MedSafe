const express = require("express");
const c = require("../controllers/notificationController");

const router = express.Router();

router.get("/notifications", c.listNotifications);
router.patch("/notifications/:id/read", c.markRead);
router.post("/notifications/read-all", c.markAllRead);

module.exports = router;
