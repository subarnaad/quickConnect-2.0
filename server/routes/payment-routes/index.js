const express = require("express");

const router = express.Router();

const initiateKhalti = require("../../controllers/khalti-payment/index");    
// const verifyKhalti = require("../../controllers/khalti-payment/index");

router.post("/khalti/initiate", initiateKhalti.initiateKhalti);
router.get("/khalti/verify", initiateKhalti.verifyKhalti);

// router.post("/khalti/initiate", initiateKhalti);
// router.post("/khalti/verify", verifyKhalti);

module.exports = router;
