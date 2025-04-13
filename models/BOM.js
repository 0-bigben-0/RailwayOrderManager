const mongoose = require("mongoose");

const RawMaterialSchema = new mongoose.Schema({
    name: { type: String,},
    specifications: { type: String },
    quantity: { type: Number,},
    unit: { type: String },
    vendor: { type: String,},
    approved: { type: Boolean, default: false } 
  }, { _id: false });

const BOMItemSchema = new mongoose.Schema({
  salesOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "SalesOrder",},
  itemName: { type: String, },
  specifications: { type: String },
  quantity: { type: Number, },
  unit: { type: String },
  vendor: { type: String }, // to be assigned later
  isOutsourced: { type: Boolean, default: false },
  rawMaterials: [RawMaterialSchema]
}, { timestamps: true });

module.exports = mongoose.model("BOMItem", BOMItemSchema);
