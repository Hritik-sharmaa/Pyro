const express = require("express");
const Comment = require("../model/comment");

const addComment = async (req, res) => {
  try {
    const { gameId, userId, email, text } = req.body;

    if (!gameId || !userId || !email || !text.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newComment = new Comment({ gameId, userId, email, text });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error adding the comment: ", err);
    res.status(500).json({ error: "Error adding comment" });
  }
};

const getComment = async (req, res) => {
  try {
    const comments = await Comment.find({ gameId: req.params.gameId }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (err) {
    console.error("Error getting the comment: ", err);
    res.status(500).json({ error: "Error fetching comments" });
  }
};

const likeComment = async (req, res) => {
  try {
    const { userId } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const index = comment.likes.indexOf(userId);
    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error("Error liking the comment: ", err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { addComment, likeComment, getComment };
