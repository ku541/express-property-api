import mongoose from 'mongoose';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

import respondIfInvalidRequest from '../helpers/validation.js';
import {
    configureCloudinary,
    optimize,
    uploadAndCleanUp
} from '../helpers/image.js';
import Property from '../mongodb/models/property.js';

const IMAGE_WIDTH = 1024;

const getProperties = async (req, res) => {
    try {
        if (respondIfInvalidRequest(req, res)) return;

        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const properties = await Property.find()
            .skip(skip)
            .limit(limit)
            .lean();

        if (!properties.length) {
            return res.status(StatusCodes.NOT_FOUND)
                .send({ error: 'Properties not found.' });
        }

        const total = await Property.countDocuments();

        return res.status(StatusCodes.OK).json({
            total,
            page,
            limit,
            pages: Math.ceil(total/limit),
            data: properties
        });
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ error: error.message });
    }
};

const findProperty = async (req, res) => { };

const createProperty = async (req, res) => {
    try {
        if (respondIfInvalidRequest(req, res)) return;

        configureCloudinary();

        const optimizedImagePath = await optimize(req, IMAGE_WIDTH);

        const image = await uploadAndCleanUp(optimizedImagePath, 'properties', req);

        const session = await mongoose.startSession();

        session.startTransaction();

        const property = await Property.create([
            { ...matchedData(req), image, owner: req.user._id }],
            { session }
        );

        req.user.properties.push(property._id);

        await req.user.save({ session });

        await session.commitTransaction();

        return res.status(StatusCodes.CREATED).json(property);
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ error: error.message });
    }
};

const updateProperty = async (req, res) => { };
const deleteProperty = async (req, res) => { };

export {
    getProperties,
    findProperty,
    createProperty,
    updateProperty,
    deleteProperty
};