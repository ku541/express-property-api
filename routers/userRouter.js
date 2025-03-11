const { Router } = require("express");

const {
  createUser,
  updateUser,
  getUsers,
  findUser,
} = require("../controllers/userController.js");
const { createUserRequest } = require("../requests/createUserRequest.js");
const authentication = require("../middlewares/authentication.js");
const { upload } = require("../helpers/image.js");
const handleMulterErrors = require("../middlewares/handleMulterErrors.js");
const updateUserRequest = require("../requests/updateUserRequest.js");
const getUsersRequest = require("../requests/getUsersRequest.js");
const findUserRequest = require("../requests/findUserRequest.js");

const router = Router();

router.post("/", createUserRequest, createUser);
router.patch(
  "/",
  [
    authentication,
    upload.single("avatar"),
    handleMulterErrors,
    updateUserRequest,
  ],
  updateUser
);
router.get("/", [authentication, getUsersRequest], getUsers);
router.get("/:id", [authentication, findUserRequest], findUser);

module.exports = router;
