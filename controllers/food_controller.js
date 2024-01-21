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
    const { foods } = req.body;

    if (!foods) {
      return res
        .status(400)
        .json({ error: "Invalid input. 'foods' should be provided" });
    }

    const isArray = Array.isArray(foods);

    const processedFoods = isArray ? foods : [{ ...foods }];

    const menuIds = processedFoods.map((food) => food.menuId);

    //check if all the menuIds exists in the database
    const existingMenus = await Menu.find({ menuId: { $in: menuIds } });
    const existingMenuIds = existingMenus.map((menu) => menu.menuId);

    const failedFoods = processedFoods.filter(
      (food) => !existingMenuIds.includes(food.menuId),
    );
    const successfulFoods = processedFoods.filter((food) =>
      existingMenuIds.includes(food.menuId),
    );

    if (successfulFoods.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid menu found in the database" });
    }

    const objectIdArray = new Array(successfulFoods.length)
      .fill()
      .map(() => new mongoose.Types.ObjectId());

    const foodsToSave = successfulFoods.map((food, index) => {
      const precisionPrice = toFixed(food.price, 2);
      return {
        _id: objectIdArray[index],
        name: food.name,
        price: precisionPrice,
        foodImage: food.foodImage,
        menuId: food.menuId,
        foodId: objectIdArray[index].toHexString(),
      };
    });

    const savedFood = await Food.insertMany(foodsToSave);
    res.status(200).json({ Success: savedFood, Failed: failedFoods });
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
