const User = require("../model/user");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user/update-name
const handleUserNameUpate = async (req,res) => {
  try{
    const { firstName, lastName } = req.body;
  const userId = req.user.id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName },
    { new: true }
  ).select("-password"); 

  res.json(updatedUser);

  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports = { getUserProfile, handleUserNameUpate };
