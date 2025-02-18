const express = require("express");
const {
  addComment,
  getComment,
  likeComment,
  replyComment,
} = require("../controllers/comment-controller");
const router = express.Router();

router.post("/add", addComment);
router.get("/:gameId", getComment);
router.post("/like/:commentId", likeComment);

module.exports = router;
