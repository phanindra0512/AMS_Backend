const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { swaggerUi, swaggerSpec } = require("./swagger");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // to parse JSON body

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop app if DB connection fails
  });

// Sample route
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});


const ownersRoutes = require("./routes/ownersRoutes");
app.use("/api/owners", ownersRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const maintenanceRoutes = require("./routes/maintenanceRoutes");

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

app.use("/api/maintenance", maintenanceRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
