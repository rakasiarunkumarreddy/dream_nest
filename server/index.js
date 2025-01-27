require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// CORS options for development and production environments
// const corsOptions = {
//   origin: process.env.NODE_ENV === "production" 
//     ? "https://your-frontend-domain.vercel.app"  // Replace with your actual production frontend URL
//     : "http://localhost:3000",  // Allow localhost in development
//   methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
//   credentials: true,  // Enable credentials (cookies, etc.)
// };

// Middleware

app.use(cors());  // Apply CORS middleware
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
const PORT = process.env.PORT || 3001;  // Use environment variable or default to 3001
const MONGO_URI = process.env.MONGO_URI || 
    "mongodb+srv://rarunreddy:moNgo%401nura@initial.kdnk9.mongodb.net/dream_nest?retryWrites=true&w=majority";  // MongoDB URI

mongoose
  .connect(MONGO_URI, {
    dbName: "dream_nest",  // Ensure this matches your database name
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((err) => console.error(`Error: ${err.message} - Could not connect to the database`));
