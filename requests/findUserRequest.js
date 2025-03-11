const { validateIdChain } = require("./findPropertyRequest.js");

const findUserRequest = [validateIdChain("User")];

module.exports = findUserRequest;
