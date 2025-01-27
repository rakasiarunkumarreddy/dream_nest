require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");



// Middleware

app.use(cors());  
app.use(express.json());
app.use(express.static("public"));

// Import routes
const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const bookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");

// Routes
app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);

// Mongoose setup
const PORT = process.env.PORT || 3001; 
const MONGO_URI = process.env.MONGO_URI || 
    "mongodb+srv://rarunreddy:moNgo%401nura@initial.kdnk9.mongodb.net/dream_nest?retryWrites=true&w=majority";  // MongoDB URI

mongoose
  .connect(MONGO_URI, {
    dbName: "dream_nest", 
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((err) => console.error(`Error: ${err.message} - Could not connect to the database`));
