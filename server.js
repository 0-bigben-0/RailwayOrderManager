const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const bomRoutes = require("./routes/bom");
const reportRoutes = require('./routes/reportRoutes');
const orderRoutes = require("./routes/orders");  // Declare orderRoutes before using it
const salesOrderRoutes = require('./routes/salesOrderRoutes');  // Declare salesOrderRoutes before using it

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use("/api/bom", bomRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/orders', orderRoutes); // Use orderRoutes here
app.use('/api/sales-orders', salesOrderRoutes); // Use salesOrderRoutes here

// Connect MongoDB
mongoose.connect("mongodb+srv://owner:dimensity@railwayordermanager.i52glc2.mongodb.net/?retryWrites=true&w=majority&appName=RailwayOrderManager", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
