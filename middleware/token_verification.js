import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      res.status(403).json({ message: "Invalid token" });
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
