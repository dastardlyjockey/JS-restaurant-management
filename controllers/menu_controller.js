import Menu from "../models/Menu.js";
import mongoose from "mongoose";

function inTimeSpan(start, end, check) {
  return start.getTime() > check.getTime() && end.getTime() < start.getTime();
}
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

export const getMenus = async (req, res) => {
  try {
    const allMenu = await Menu.find({});
    res.status(200).json(allMenu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMenuById = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menu = await Menu.findOne({ menuId });
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const menu = req.body;

    const { menuId } = req.params;

    const filter = { menuId: menuId };

    const updateObj = {};

    if (menu.startDate && menu.endDate) {
      if (
        !inTimeSpan(
          new Date(menu.startDate),
          new Date(menu.endDate),
          new Date(),
        )
      ) {
        const msg = "Kindly retype the date";
        return res.status(500).json({ error: msg });
      }

      //assign the updated values to the updateObj
      updateObj.startDate = new Date(menu.startDate);
      updateObj.endDate = new Date(menu.endDate);
    }

    if (menu.name) {
      updateObj.name = menu.name;
    }

    if (menu.category) {
      updateObj.category = menu.category;
    }

    updateObj.updatedAt = new Date();

    //update the menuId in the database

    const result = await Menu.updateOne(filter, { $set: updateObj });

    const msg = `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`;

    res.status(200).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
