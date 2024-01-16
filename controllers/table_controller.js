import mongoose from "mongoose";
import Table from "../models/Table.js";

export const createTable = async (req, res) => {
  try {
    const { numberOfGuests, tableNumber } = req.query;

    const objectId = new mongoose.Types.ObjectId();
    const table = new Table({
      _id: objectId,
      numberOfGuests,
      tableNumber,
      tableId: objectId.toHexString(),
    });
    const savedTable = await table.save();
    res.status(200).json(savedTable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTables = async (req, res) => {
  try {
    const result = await Table.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTableById = async (req, res) => {
  try {
    const { tableId } = req.params;
    const table = await Table.findOne(tableId);
    res.status(200).json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { numberOfGuests, tableNumber } = req.body;
    const { tableId } = req.params;
    const filter = { tableId: tableId };

    const updateObj = {};

    // set up the update object
    if (numberOfGuests) {
      updateObj.numberOfGuests = numberOfGuests;
    }

    if (tableNumber) {
      updateObj.tableNumber = tableNumber;
    }

    updateObj.updatedAt = new Date();

    // update the table in the database
    const result = await Table.updateOne(filter, { $set: updateObj });

    const msg = `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`;

    res.status(200).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
