const express = require("express");
const { checkOut, getUserOrder } = require("../controllers/order-controller");
const router = express.Router();

router.post("/checkout", checkOut);
router.get("/:userId", getUserOrder);

module.exports = router;
