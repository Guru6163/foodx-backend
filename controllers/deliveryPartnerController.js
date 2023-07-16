const DeliveryPartner = require("../models/deliveryPartnerModel");

// Create a new delivery partner
const createDeliveryPartner = async (req, res) => {
    try {
        const deliveryPartner = await DeliveryPartner.create(req.body);
        res.status(201).json({
            status: "success",
            data: deliveryPartner,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Failed to create delivery partner.",
            error: error.message,
        });
    }
};

// Get all delivery partners
const getAllDeliveryPartners = async (req, res) => {
    try {
        const deliveryPartners = await DeliveryPartner.find();
        res.status(200).json({
            status: "success",
            data: deliveryPartners,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Failed to retrieve delivery partners.",
            error: error.message,
        });
    }
};

// Get a single delivery partner by ID
const getDeliveryPartnerById = async (req, res) => {
    try {
        const deliveryPartnerId = req.params.id;
        const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
        if (!deliveryPartner) {
            return res.status(404).json({
                status: "fail",
                message: "Delivery partner not found.",
            });
        }
        res.status(200).json({
            status: "success",
            data: deliveryPartner,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Failed to retrieve delivery partner.",
            error: error.message,
        });
    }
};

// Update a delivery partner
const updateDeliveryPartner = async (req, res) => {
    const deliveryPartnerId = req.params.id;

    try {
        const deliveryPartner = await DeliveryPartner.findByIdAndUpdate(
            deliveryPartnerId,
            req.body,
            { new: true }
        );
        if (!deliveryPartner) {
            return res.status(404).json({
                status: "fail",
                message: "Delivery partner not found.",
            });
        }
        res.status(200).json({
            status: "success",
            data: deliveryPartner,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Failed to update delivery partner.",
            error: error.message,
        });
    }
};

// Delete a delivery partner
const deleteDeliveryPartner = async (req, res) => {
    const deliveryPartnerId = req.params.id;

    try {
        const deliveryPartner = await DeliveryPartner.findByIdAndDelete(deliveryPartnerId);
        if (!deliveryPartner) {
            return res.status(404).json({
                status: "fail",
                message: "Delivery partner not found.",
            });
        }
        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Failed to delete delivery partner.",
            error: error.message,
        });
    }
};

module.exports = {
    createDeliveryPartner,
    getAllDeliveryPartners,
    getDeliveryPartnerById,
    updateDeliveryPartner,
    deleteDeliveryPartner,
};
