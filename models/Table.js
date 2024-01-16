import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    tableId: {
      type: String,
    },
  },
  { timestamps: true },
);

const Table = mongoose.model("Table", tableSchema);
export default Table;
