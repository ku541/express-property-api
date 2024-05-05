import { randomInt } from 'node:crypto';

import mongoose from 'mongoose';

const MIN_OTP = 100000;
const MAX_OTP = 999999;
const OTP_VALIDITY_IN_MINUTES = 10;

const transformUser = (doc, ret) => {
    delete ret.otp;

    return ret;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: String,
    otp: {
        code: {
            type: Number,
            min: MIN_OTP,
            max: MAX_OTP
        },
        expiresAt: Date
    },
    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }]
},{
    timestamps: true,
    toJSON: { transform: transformUser }
});

userSchema.methods.generateOTP = function () {
    const code = randomInt(MIN_OTP, MAX_OTP);

    const expiresAt = new Date;

    expiresAt.setUTCMinutes(expiresAt.getUTCMinutes() + OTP_VALIDITY_IN_MINUTES);

    this.otp = { code, expiresAt };

    return this;
}

const User = mongoose.model('User', userSchema);

export {
    User as default,
    OTP_VALIDITY_IN_MINUTES,
    MIN_OTP,
    MAX_OTP
}