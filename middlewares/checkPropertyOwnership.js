import { StatusCodes } from 'http-status-codes';

import Property from '../mongodb/models/property.js';

const checkPropertyOwnership = async (req, res, next) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        if (! property) {
            return res.status(StatusCodes.NOT_FOUND)
                .send({ error: 'Property not found.' });
        }
    }

    if (!req.user._id.equals(property.owner)) {
        return res.status(StatusCodes.FORBIDDEN)
            .send({ error: 'Insufficient permissions.' });
    }

    req.property = property;

    next();
}

export default checkPropertyOwnership;