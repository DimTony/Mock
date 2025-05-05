const mongoose = require("mongoose");

const TestUserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    fullName: {
      type: String,
    },
    username: {
      type: String,
    },
    role: {
      type: String,
    },
    country: {
      type: String,
    },
    branchCode: {
      type: String,
    },
    status: {
      type: String,
    },
    requestType: {
      type: String,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("TestUser", TestUserSchema);
