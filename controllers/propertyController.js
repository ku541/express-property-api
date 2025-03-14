const mongoose = require("mongoose");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const respondIfInvalidRequest = require("../helpers/validation.js");
const {
  configureCloudinary,
  optimize,
  uploadAndCleanUp,
  destroy,
} = require("../helpers/image.js");
const Property = require("../mongodb/models/property.js");

const IMAGE_WIDTH = 1024;

const getProperties = async (req, res) => {
  try {
    if (respondIfInvalidRequest(req, res)) return;

    const {
      page = 1,
      limit = 10,
      type = "",
      title = "",
      sort = "createdAt",
      order = "desc",
    } = matchedData(req);
    const skip = (page - 1) * limit;

    const query = {};

    if (type) {
      query.type = type;
    }

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    const properties = await Property.find(query)
      .skip(skip)
      .limit(limit)
      .sort([[sort, order]])
      .lean();

    if (!properties.length) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "Properties not found." });
    }

    const total = await Property.countDocuments();

    return res.status(StatusCodes.OK).json({
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      data: properties,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

const findProperty = async (req, res) => {
  try {
    if (respondIfInvalidRequest(req, res)) return;

    const property = await Property.findById(req.params.id)
      .lean()
      .populate("owner");

    if (!property) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "Property not found." });
    }

    return res.status(StatusCodes.OK).json(property);
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

const createProperty = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    if (respondIfInvalidRequest(req, res)) return;

    const optimizedImagePath = await optimize(req, IMAGE_WIDTH);

    configureCloudinary();

    const image = await uploadAndCleanUp(optimizedImagePath, "properties", req);

    const property = new Property({
      ...matchedData(req),
      image,
      owner: req.user._id,
    });

    await property.save({ session });

    req.user.properties.push(property._id);

    await req.user.save({ session });

    await session.commitTransaction();

    return res.status(StatusCodes.CREATED).json(property);
  } catch (error) {
    await session.abortTransaction();

    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  } finally {
    await session.endSession();
  }
};

const updateProperty = async (req, res) => {
  try {
    if (respondIfInvalidRequest(req, res)) return;

    if (req.file) {
      const optimizedImagePath = await optimize(req, IMAGE_WIDTH);

      configureCloudinary();

      const image = await uploadAndCleanUp(
        optimizedImagePath,
        "properties",
        req
      );

      if (req.property.image) {
        await destroy(req.property.image);
      }

      await req.property.set({ ...matchedData(req), image }).save();
    } else {
      await req.property.set({ ...matchedData(req) });
    }

    return res.status(StatusCodes.OK).send(req.property);
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    if (respondIfInvalidRequest(req, res)) return;

    configureCloudinary();

    await destroy(req.property.image);

    req.user.properties.pull(req.property._id);

    await req.user.save({ session });

    await req.property.deleteOne().session(session);

    await session.commitTransaction();

    return res.status(StatusCodes.OK).send();
  } catch (error) {
    await session.abortTransaction();

    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  } finally {
    await session.endSession();
  }
};

module.exports = {
  getProperties,
  findProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
