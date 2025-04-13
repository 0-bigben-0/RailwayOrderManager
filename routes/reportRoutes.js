const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/sales-orders", reportController.exportSalesOrders);
router.get("/bom/:salesOrderId", reportController.exportBOMBySalesOrder);
router.get("/raw-materials/:bomId", reportController.exportRawMaterials);

module.exports = router;
