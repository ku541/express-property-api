const { Router } = require("express");

const createTokenRequest = require("../requests/createTokenRequest.js");
const createToken = require("../controllers/tokenController.js");

const router = Router();

router.post("/", createTokenRequest, createToken);

module.exports = router;
