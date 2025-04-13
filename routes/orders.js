const express = require("express");
const router = express.Router();
const SalesOrder = require("../models/SalesOrder");

// 👉 POST /api/orders - create new order
router.post("/", async (req, res) => {
  try {
    const order = new SalesOrder(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 👉 GET /api/orders - get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await SalesOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 GET /api/orders/:id - get one order
router.get("/:id", async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 PUT /api/orders/:id - update order
router.put("/:id", async (req, res) => {
  try {
    const updated = await SalesOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 👉 DELETE /api/orders/:id - delete order
router.delete("/:id", async (req, res) => {
  try {
    await SalesOrder.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
