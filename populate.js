import Expense from "./server/models/Expense.js";
import expenses from "./expenses.json" with { type: "json" };

const populateDB = async () => await Expense.insertMany(expenses);

export default populateDB;
