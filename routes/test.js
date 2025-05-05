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
  getRoleOptions,
  getBranchCodeOptions,
  getCountryOptions,
  getAuditLogs,
  getEmailTemplates,
} = require("../controllers/testController");

router.post("/users/add", createUser);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.get("/users/:id", getUserById);
router.post("/users/bulk", bulkCreateUsers);

router.get("/logs", getAuditLogs);

router.get("/templates/email", getEmailTemplates);

router.get("/requests", getAllRequests);

router.get("/roles", getAllRoles);
router.get("/roles/:id", getRoleById);
router.post("/roles/bulk", bulkCreateRoles);

router.get("/options/roles", getRoleOptions);
router.get("/options/countries", getCountryOptions);
router.get("/options/branch-codes", getBranchCodeOptions);

module.exports = router;
