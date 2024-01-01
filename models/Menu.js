import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    menuId: {
      type: String,
    },
  },
  { timestamps: true },
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
