const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../util/MongoDB");

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await connectToDatabase();
  const todos = await db.collection("tasklist").find().toArray();
  res.json(todos);
});

router.post("/", async (req, res) => {
  const db = await connectToDatabase();
  const newTodo = req.body;

  try {
    // 確保 newTodo 沒有 _id，讓 MongoDB 自動生成
    if (newTodo._id) {
      delete newTodo._id;
    }

    console.log("Inserting new todo:", newTodo);

    const result = await db.collection("tasklist").insertOne(newTodo);

    if (!result.acknowledged) {
      throw new Error("Insertion failed");
    }

    console.log("Insertion result:", result);

    const insertedTodo = await db
      .collection("tasklist")
      .findOne({ _id: result.insertedId });

    if (!insertedTodo) {
      throw new Error("Could not find the inserted todo");
    }

    res.json(insertedTodo);
  } catch (err) {
    console.error("Error inserting new todo:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const todoId = req.params.id;
    const updatedFields = req.body;

    console.log(`Updating todo with id: ${todoId}`);
    console.log("Updated fields:", updatedFields);

    const result = await db
      .collection("tasklist")
      .updateOne({ _id: new ObjectId(todoId) }, { $set: updatedFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updatedTodo = await db
      .collection("tasklist")
      .findOne({ _id: new ObjectId(todoId) });
    res.json(updatedTodo);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const db = await connectToDatabase();
  const todoId = req.params.id;

  try {
    const result = await db
      .collection("tasklist")
      .deleteOne({ _id: new ObjectId(todoId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
