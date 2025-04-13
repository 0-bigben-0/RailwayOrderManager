const { Parser } = require("json2csv");
const SalesOrder = require("../models/SalesOrder");
const BOMItem = require("../models/BOM");

// Export all Sales Orders
exports.exportSalesOrders = async (req, res) => {
  try {
    const salesOrders = await SalesOrder.find().lean();
    const parser = new Parser();
    const csv = parser.parse(salesOrders);

    res.header("Content-Type", "text/csv");
    res.attachment("sales_orders.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export all BOM items for a sales order
exports.exportBOMBySalesOrder = async (req, res) => {
  try {
    const { salesOrderId } = req.params;
    const bomItems = await BOMItem.find({ salesOrderId }).lean();

    const parser = new Parser();
    const csv = parser.parse(bomItems);

    res.header("Content-Type", "text/csv");
    res.attachment("bom_items.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export raw materials for a BOM item
exports.exportRawMaterials = async (req, res) => {
  try {
    const { bomId } = req.params;
    const bomItem = await BOMItem.findById(bomId).lean();

    if (!bomItem || !bomItem.rawMaterials)
      return res.status(404).json({ error: "No raw materials found" });

    const parser = new Parser();
    const csv = parser.parse(bomItem.rawMaterials);

    res.header("Content-Type", "text/csv");
    res.attachment("raw_materials.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
