const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  bulkCreateUsers,
  getUserById,
  updateUser,
  getAllRequests,
  getAllRoles,
  bulkCreateRoles,
  getRoleById,
} = require("../controllers/testController");

router.post("/users/add", createUser);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.get("/users/:id", getUserById);
router.post("/users/bulk", bulkCreateUsers);
router.get("/requests", getAllRequests);
router.get("/roles", getAllRoles);
router.get("/roles/:id", getRoleById);
router.post("/roles/bulk", bulkCreateRoles);

module.exports = router;
