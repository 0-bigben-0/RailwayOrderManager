const express = require('express');
const router = express.Router();
const SalesOrder = require('../models/SalesOrder');

// Create new Sales Order
router.post('/', async (req, res) => {
  try {
    const newOrder = new SalesOrder(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Sales Orders
router.get('/', async (req, res) => {
  try {
    const orders = await SalesOrder.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/dropdown', async (req, res) => {
  try {
    const orders = await SalesOrder.find({}, '_id salesOrderNumber').sort({ salesOrderNumber: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales orders for dropdown' });
  }
});

module.exports = router;
