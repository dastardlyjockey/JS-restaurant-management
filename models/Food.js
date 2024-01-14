import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
    },
    foodImage: {
      type: String,
      required: true,
    },
    foodId: {
      type: String,
    },
    menuId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Food = mongoose.model("Food", foodSchema);

export default Food;
