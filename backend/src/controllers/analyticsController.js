const Analytics = require("../models/Analytics");

// Summary
exports.getSummary = async (req, res) => {
  try {
    const result = await Analytics.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: "$users" },
          totalRevenue: { $sum: "$revenue" },
          totalSessions: { $sum: "$sessions" },
        },
      },
    ]);
    res.json(result[0] || {});
  } catch (err) {
    console.error("getSummary error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

// Trends
exports.getTrends = async (req, res) => {
  try {
    const data = await Analytics.aggregate([{ $sort: { date: 1 } }]);
    res.json(data);
  } catch (err) {
    console.error("getTrends error:", err);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
};

// Top days
exports.getTopDays = async (req, res) => {
  try {
    const data = await Analytics.aggregate([
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);
    res.json(data);
  } catch (err) {
    console.error("getTopDays error:", err);
    res.status(500).json({ error: "Failed to fetch top days" });
  }
};

// Seed data
exports.seedData = async (req, res) => {
  try {
    const sample = [];
    for (let i = 1; i <= 10; i++) {
      sample.push({
        date: new Date(2024, 0, i),
        users: Math.floor(Math.random() * 100),
        revenue: Math.floor(Math.random() * 1000),
        sessions: Math.floor(Math.random() * 200),
      });
    }
    await Analytics.insertMany(sample);
    res.json({ message: "Seeded successfully" });
  } catch (err) {
    console.error("seedData error:", err);
    res.status(500).json({ error: "Failed to seed data" });
  }
};
