const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require("./routes/auth");
const stockRoutes = require("./routes/stocks");
const portfolioRoutes = require("./routes/portfolio");
const transactionRoutes = require("./routes/transactions");
const userRoutes = require("./routes/users");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

// ** Serve Frontend After Build **
app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});


app.use(cors({
  origin: "*", // Allow requests from anywhere (for testing)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


module.exports = app;
