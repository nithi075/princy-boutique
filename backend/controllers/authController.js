import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const phoneLogin = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    // Check if user exists
    let user = await User.findOne({ phone });

    // If not exist → create user automatically
    if (!user) {
      user = await User.create({ phone });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        phone: user.phone,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
