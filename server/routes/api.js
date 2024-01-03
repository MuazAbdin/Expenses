import { Router } from "express";
import moment from "moment";
import Expense from "../models/Expense.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { groups, d1, d2 } = req.query;
    const filter = d1
      ? {
          date: {
            $gte: moment(d1).format("LLLL"),
            $lte: moment(d2).format("LLLL"),
          },
        }
      : {};
    let docs = [];
    if (groups) {
      docs = await Expense.aggregate([
        { $group: { _id: "$group", itemsCount: { $sum: 1 } } },
        { $sort: { group: 1 } },
      ]);
    } else {
      docs = await Expense.find(filter).sort({ date: -1 });
    }
    res.send({ count: docs.length, docs });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ msg: error.message });
  }
});

router.get("/:group", async (req, res) => {
  try {
    let docs = [];
    if (!req.query.total)
      docs = await Expense.find({ group: req.params.group }).sort({ date: -1 });
    else
      docs = await Expense.aggregate([
        { $match: { group: req.params.group } },
        { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
      ]);
    res.send({ count: docs.length, docs });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ msg: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      date: moment(req.body.date).format("LLLL"),
    });
    await expense.save();
    res.status(201).send(expense);
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ msg: error.message });
  }
});

router.patch("/:group", async (req, res) => {
  try {
    if (!req.body.group) return res.status(204).end();
    const expense = await Expense.findOneAndUpdate(
      { group: req.params.group },
      { group: req.body.group },
      { new: true }
    );
    res.send({
      item: expense.item,
      prevGroup: req.params.group,
      curGroup: expense.group,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ msg: error.message });
  }
});

export default router;
