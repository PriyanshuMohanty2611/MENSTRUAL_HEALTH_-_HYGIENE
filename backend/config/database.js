const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      dbName: "MENSTRUAL_CYCLE_DATA",
    };

    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/MENSTRUAL_CYCLE_DATA",
      options,
    );

    console.log("✓ MongoDB connected successfully");
    console.log(`  Database: ${mongoose.connection.name}`);
    console.log(`  Host: ${mongoose.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (error) {
    // console.log("✗ MongoDB connection failed:", error.message);
    // process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
