import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore"; // Import the auth store
import { useParams } from "react-router-dom"; // Get gameId from URL
import axios from "axios"; // Import axios
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";

const CommentSection = () => {
  const { gameId } = useParams(); // Extract gameId from URL
  const { user, isAuthenticated } = useAuthStore(); // Get user details from Zustand store

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState(""); // State for reply text

  useEffect(() => {
    // Fetch comments using axios
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/comments/${gameId}`)
      .then((response) => setComments(response.data))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [gameId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/add`,
        {
          gameId,
          userId: user?.userId, // Using userId from auth store
          email: user?.email, // Using email from auth store
          text: newComment,
        }
      );

      // Add the new comment to the list
      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment(""); // Clear the input
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/like/${commentId}`,
        {
          userId: user?.userId,
        }
      );

      // Update the comment in the state
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === response.data._id ? response.data : comment
        )
      );
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  return (
    <div className="mt-28">
      <h2 className="text-3xl font-bold">Comments</h2>

      {isAuthenticated ? (
        <div className="flex gap-2 my-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="p-4 border rounded-full w-full text-white  outline-none bg-transparent"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-[#66CC41] text-black px-5 rounded-lg">
            Post
          </button>
        </div>
      ) : (
        <p className="text-gray-500 my-4">Log in to post a comment.</p>
      )}

      <div className="p-4 space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="bg-zinc-950 p-4 rounded-lg">
              <p className="font-bold text-xl">{comment.email}: </p>
              <div className="bg-zinc-900 rounded p-4 flex items-center justify-between mt-2 ml-5">
                <p>{comment.text}</p>
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className="text-[#66CC41] flex items-center gap-3">
                  {comment.likes.includes(user?.userId) ? (
                    <AiOutlineDislike />
                  ) : (
                    <AiOutlineLike />
                  )}
                  {comment.likes.length}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
