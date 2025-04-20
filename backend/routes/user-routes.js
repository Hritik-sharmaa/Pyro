const express = require("express");
const {
  getUserProfile,
  handleUserNameUpate,
} = require("../controllers/user-controller");
const { protect } = require("../middlewares/auth-middleware");
const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/update-name", protect, handleUserNameUpate);

module.exports = router;
