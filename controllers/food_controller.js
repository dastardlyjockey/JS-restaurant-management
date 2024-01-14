import Menu from "../models/Menu.js";
import mongoose from "mongoose";
import Food from "../models/Food.js";

function round(num) {
  return Math.round(num + Math.sign(num) * 0.5);
}
function toFixed(num, precision) {
  const output = Math.pow(10, precision);
  return round(num * output) / output;
}
export const createFood = async (req, res) => {
  try {
    const { name, foodImage, price, menuId } = req.body;

    const result = await Menu.findOne(menuId);
    if (!result) {
      return res.status(404).json({ error: "The menu does not exist" });
    }

    const objectId = new mongoose.Types.ObjectId();

    const precisionPrice = toFixed(price, 2);

    const food = new Food({
      _id: objectId,
      name,
      price: precisionPrice,
      foodImage,
      menuId,
      foodId: objectId.toHexString(),
    });

    const savedFood = await food.save();
    res.status(200).json(savedFood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFoods = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const matchStage = { $match: {} };
    const groupStage = {
      $group: {
        _id: { _id: null },
        total_count: { $sum: 1 },
        data: { $push: "$$ROOT" },
      },
    };
    const projectStage = {
      $project: {
        _id: 0,
        total_count: 1,
        food_items: { $slice: ["$data", skip, limit] },
      },
    };

    const result = await Food.aggregate([matchStage, groupStage, projectStage]);

    const allFood = result[0];

    res.status(200).json(allFood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const { foodId } = req.params;
    const result = await Food.findById(foodId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const food = req.body;
    const { foodId } = req.params;

    const filter = { foodId: foodId };

    const updateObj = {};

    //check if the menuId exists in the database
    const isMenuAvailable = await Menu.findOne({ menuId: food.menuId });
    if (!isMenuAvailable) {
      return res.status(404).json({ message: "The menu is not available" });
    }

    // update the food item
    if (food.name != "") {
      updateObj.name = food.name;
    }

    if (food.price) {
      const precisionPrice = toFixed(food.price, 2);
      updateObj.price = precisionPrice;
    }

    if (food.foodImage) {
      updateObj.foodImage = food.foodImage;
    }

    updateObj.updatedAt = new Date();

    //update the food structure in the database
    const result = await Food.updateOne(filter, { $set: updateObj });
    const msg = `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`;

    res.status(200).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
