import { Schema, model } from "mongoose";

const expenseSchema = Schema(
  {
    item: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    group: { type: String, enum: ["bills", "food", "fun", "misc", "rent"] },
  },
  { timestamps: true }
);

export default model("Expense", expenseSchema);
