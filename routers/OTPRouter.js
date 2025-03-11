const { Router } = require("express");

const { validateEmailChain } = require("../requests/createUserRequest.js");
const createOTP = require("../controllers/OTPController.js");

const router = Router();

router.post("/", validateEmailChain(), createOTP);

module.exports = router;
