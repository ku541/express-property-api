import { StatusCodes } from 'http-status-codes';
import { validationResult } from 'express-validator';

const respondIfInvalid = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
}

export {
    respondIfInvalid
};