const { Router } = require("express");

const {
  getProperties,
  findProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController.js");
const authentication = require("../middlewares/authentication.js");
const { upload } = require("../helpers/image.js");
const handleMulterErrors = require("../middlewares/handleMulterErrors.js");
const createPropertyRequest = require("../requests/createPropertyRequest.js");
const { getPropertiesRequest } = require("../requests/getPropertiesRequest.js");
const { findPropertyRequest } = require("../requests/findPropertyRequest.js");
const checkPropertyOwnership = require("../middlewares/checkPropertyOwnership.js");
const updatePropertyRequest = require("../requests/updatePropertyRequest.js");

const router = Router();

router.get("/", [authentication, getPropertiesRequest], getProperties);
router.get("/:id", [authentication, findPropertyRequest], findProperty);
router.post(
  "/",
  [
    authentication,
    upload.single("image"),
    handleMulterErrors,
    createPropertyRequest,
  ],
  createProperty
);
router.patch(
  "/:id",
  [
    authentication,
    upload.single("image"),
    handleMulterErrors,
    updatePropertyRequest,
    checkPropertyOwnership,
  ],
  updateProperty
);
router.delete(
  "/:id",
  [authentication, findPropertyRequest, checkPropertyOwnership],
  deleteProperty
);

module.exports = router;
