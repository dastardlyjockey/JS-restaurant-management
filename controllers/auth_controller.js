import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({ error: "The email address is not registered" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ error: "The password is not correct" });
    }

    const secretKey = process.env.SECRET_KEY;
    const token = await jwt.sign(
      { userId: user._id, firstName: user.firstName, lastName: user.lastName },
      secretKey,
      { expiresIn: "1h" },
    );

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
