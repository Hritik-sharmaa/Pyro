const express = require("express");
const { checkOut, getUserOrder, confirmOrderEmail } = require("../controllers/order-controller");
const router = express.Router();

router.post("/checkout", checkOut);
router.get("/:userId", getUserOrder);
router.post("/confirm", confirmOrderEmail)

module.exports = router;
