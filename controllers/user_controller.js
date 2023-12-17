import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);

    let usersWithoutPassword = [];

    for (let user of users) {
      const userWithoutPassword = { ...user._doc };
      delete userWithoutPassword.password;
      usersWithoutPassword.push(userWithoutPassword);
    }

    const totalCount = await User.countDocuments();

    res.status(200).json({ totalCount, users: usersWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
