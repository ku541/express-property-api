import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const respondIfInvalidRequest = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(StatusCodes.BAD_REQUEST)
            .json({ errors: errors.array() });

        return true;
    }

    return false;
}

export default respondIfInvalidRequest;