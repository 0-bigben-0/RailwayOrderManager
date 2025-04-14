const mongoose = require('mongoose');

const SalesOrderSchema = new mongoose.Schema({
  salesOrderNumber: { type: String, required: true },
  salesOrderDate: { type: Date, required: true },
  itemDescription: { type: String, required: true },
  drawingNumber: { type: String }, // optional field
  quantity: { type: Number, required: true },
  railwayZone: { type: String, required: true },
  deliveryDateRange: {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  deliveryDateExtension: { type: Date }, // optional field
  consignee: {
    address: { type: String },
    phone: { type: String },
  },
}, { timestamps: true }); // adds createdAt and updatedAt fields automatically

module.exports = mongoose.model('SalesOrder', SalesOrderSchema);
