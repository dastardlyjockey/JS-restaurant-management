import bcrypt from "bcrypt";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar, phone } = req.body;

    const isEmailRegistered = await User.findOne({ email });
    if (isEmailRegistered) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const isPhoneNumberRegistered = await User.findOne({ phone });
    if (isPhoneNumberRegistered) {
      return res
        .status(400)
        .json({ error: "Phone number is already registered" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHashed = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHashed,
      avatar,
      phone,
    });
    const savedUser = await user.save();

    const responseUser = { ...savedUser._doc };
    delete responseUser.password;

    res.status(201).json(responseUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
