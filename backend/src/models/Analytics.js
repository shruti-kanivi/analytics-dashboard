const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  date: Date,
  users: Number,
  revenue: Number,
  sessions: Number,
});

module.exports = mongoose.model("Analytics", analyticsSchema);
