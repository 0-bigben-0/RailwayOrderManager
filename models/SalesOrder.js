const mongoose = require('mongoose');

const SalesOrderSchema = new mongoose.Schema({
  salesOrderNumber: { type: String, required: true },
  salesOrderDate: { type: Date, required: true },
  deliveryDateRange: {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  itemDescription: { type: String, required: true },
  drawingNumber: { type: String },
  quantity: { type: Number, required: true },
  deliveryDateExtension: { type: Date }, // optional
  consignee: {
    address: { type: String },
    phone: { type: String }
  },
  railwayZone: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("SalesOrder", SalesOrderSchema);
