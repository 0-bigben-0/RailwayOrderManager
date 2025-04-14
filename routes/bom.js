const express = require("express");
const router = express.Router();
const BOMItem = require("../models/BOM"); // Ensure this path is correct
const SalesOrder = require("../models/SalesOrder");

// Middleware to handle JSON requests
router.use(express.json());

/**
 * Get a single BOM item by ID
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const bom = await BOMItem.findById(id).populate({
            path: "salesOrderId", // Assuming the field in BOM schema is salesOrderId
            select: "salesOrderNumber", // Only get this field
        });

        if (!bom) {
            return res.status(404).json({ message: "BOM not found" });
        }

        // Manually attach salesOrderNumber for frontend
        const bomWithOrderNumber = {
            ...bom.toObject(),
            salesOrderNumber: bom.salesOrderId?.salesOrderNumber || null,
        };

        res.json(bomWithOrderNumber);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * Get all BOM items for a specific Sales Order
 */
router.get("/salesOrder/:salesOrderId", async (req, res) => {
    const { salesOrderId } = req.params;
    try {
        const items = await BOMItem.find({ salesOrderId });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Create a new BOM item
 */
router.post("/", async (req, res) => {
    try {
        const newItem = new BOMItem(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Add raw materials to a BOM item
 */
router.post("/:bomId/raw-materials", async (req, res) => {
    const { bomId } = req.params;
    const { name, specifications, quantity, unit, vendor } = req.body;
    try {
        const bomItem = await BOMItem.findById(bomId);
        if (!bomItem) return res.status(404).json({ error: "BOM Item not found" });

        bomItem.rawMaterials.push({ name, specifications, quantity, unit, vendor });
        await bomItem.save();
        res.status(201).json(bomItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Approve a specific raw material by index
 */
router.patch("/:bomId/raw-materials/:index/approve", async (req, res) => {
    const { bomId, index } = req.params;
    try {
        const bomItem = await BOMItem.findById(bomId);
        if (!bomItem) return res.status(404).json({ error: "BOM Item not found" });

        const rawMaterialIndex = parseInt(index);
        if (!bomItem.rawMaterials[rawMaterialIndex]) return res.status(404).json({ error: "Raw Material not found" });

        bomItem.rawMaterials[rawMaterialIndex].approved = true;
        await bomItem.save();
        res.json({ message: "Raw material approved", rawMaterials: bomItem.rawMaterials });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Update a BOM item
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await BOMItem.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "BOM Item not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Delete a BOM item
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await BOMItem.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "BOM Item not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Update the status of a raw material by its name
 */
router.patch("/:bomId/raw-material/status", async (req, res) => {
    const { bomId } = req.params;
    const { materialName, newStatus } = req.body;

    const allowedStatuses = ["Pending", "Ordered", "In Transit", "Delivered"];
    if (!allowedStatuses.includes(newStatus)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    try {
        const updatedBOM = await BOMItem.findOneAndUpdate(
            { _id: bomId, "rawMaterials.name": materialName },
            { $set: { "rawMaterials.$.status": newStatus } },
            { new: true }
        );

        if (!updatedBOM) return res.status(404).json({ error: "Raw material not found" });

        res.status(200).json(updatedBOM);
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err });
    }
});

/**
 * Update a specific raw material for a BOM
 */
router.put("/:bomId/raw-materials", async (req, res) => {
    const { bomId } = req.params;
    const updatedMaterial = req.body;

    try {
        const bomItem = await BOMItem.findById(bomId);
        if (!bomItem) {
            return res.status(404).json({ error: "BOM Item not found" });
        }

        // Find the raw material by name and update its details
        const materialIndex = bomItem.rawMaterials.findIndex(
            (material) => material.name === updatedMaterial.name
        );

        if (materialIndex === -1) {
            return res.status(404).json({ error: "Raw Material not found" });
        }

        bomItem.rawMaterials[materialIndex] = updatedMaterial;
        await bomItem.save();

        res.status(200).json(bomItem);
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

/**
 * Get all BOMs with sales order details
 */
router.get("/", async (req, res) => {
    try {
        const boms = await BOMItem.aggregate([
            {
                $lookup: {
                    from: "salesorders", // Collection name for sales orders
                    localField: "salesOrderId",
                    foreignField: "_id",
                    as: "salesOrderDetails",
                },
            },
            {
                $unwind: {
                    path: "$salesOrderDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    salesOrderId: 1,
                    itemName: 1,
                    specifications: 1,
                    quantity: 1,
                    unit: 1,
                    vendor: 1,
                    isOutsourced: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    rawMaterials: 1,
                    salesOrderNumber: "$salesOrderDetails.salesOrderNumber",
                },
            },
        ]);
        res.json(boms);
    } catch (error) {
        console.error("Error fetching BOMs:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;