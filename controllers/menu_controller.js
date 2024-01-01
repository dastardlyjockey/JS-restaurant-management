import Menu from "../models/Menu.js";
import mongoose from "mongoose";

export const createMenu = async (req, res) => {
  try {
    const { name, category, endDate, startDate } = req.body;

    const existingMenuNameAndCategory = await Menu.findOne({ name, category });

    if (existingMenuNameAndCategory) {
      if (new Date(existingMenuNameAndCategory.endDate) > new Date()) {
        res
          .status(400)
          .json({ error: "The category already exists in that Menu " });
        return;
      }
    }

    const objectId = new mongoose.Types.ObjectId();
    const menu = new Menu({
      _id: objectId,
      name,
      category,
      endDate,
      startDate,
      menuId: objectId.toHexString(),
    });

    const savedMenu = await menu.save();
    res.status(200).json(savedMenu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
