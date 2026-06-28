// controllers/serviceController.js

const Service = require("../models/Service");

const createService = async (req, res) => {
  try {
    const {
      serviceType,
      customServiceType,
      serviceProviderName,
      mobileNumber,
      location,
    } = req.body;

    if (
      !serviceType ||
      !serviceProviderName ||
      !mobileNumber ||
      !location
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (
      serviceType.toUpperCase() === "OTHER" &&
      !customServiceType
    ) {
      return res.status(400).json({
        error: "Custom service type is required.",
      });
    }

    const existing = await Service.findOne({
      mobileNumber,
    });

    if (existing) {
      return res.status(409).json({
        error: "Service provider already exists.",
      });
    }

    const service = await Service.create({
      serviceType: serviceType.toUpperCase(),
      customServiceType:
        serviceType.toUpperCase() === "OTHER"
          ? customServiceType
          : null,
      serviceProviderName,
      mobileNumber,
      location,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      totalServices: services.length,
      data: services,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


module.exports = {
  createService,
  getAllServices
};