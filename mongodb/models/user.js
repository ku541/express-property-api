import { randomInt } from 'node:crypto';

import mongoose from 'mongoose';

const MIN_OTP = 100000;
const MAX_OTP = 999999;
const OTP_VALIDITY_IN_MILLISECONDS = 10 * 60 * 1000;

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
        expiresAt: Number
    },
    properties: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }]
},{
    timestamps: true
});

userSchema.methods.generateOTP = () => {
    const code = randomInt(MIN_OTP, MAX_OTP);

    const expiresAt = Date.now() + OTP_VALIDITY_IN_MILLISECONDS;

    return { code, expiresAt };
}

const User = mongoose.model('User', userSchema);

export default User;