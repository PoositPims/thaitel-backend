const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
router.get("/", searchController.getAllData);
router.get("/province", searchController.getProvince);


module.exports = router;