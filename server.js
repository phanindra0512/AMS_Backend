const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // to parse JSON body

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
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

// Import routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const ownersRoutes = require("./routes/ownersRoutes");
app.use("/api/owners", ownersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
