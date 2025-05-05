const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    enabled: { type: Boolean, default: false },
  },
  { _id: false }
); // prevent creation of extra _id for subdocuments

const roleSchema = new mongoose.Schema({
  adRoleName: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  dateAdded: { type: String, required: true }, // can change to Date if needed
  createdBy: { type: String, default: "N/A" },
  userCount: { type: Number, default: 0 },
  permissions: [permissionSchema],
});

module.exports = mongoose.model("TestRole", roleSchema);
