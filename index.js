import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import userRouter from './routers/userRouter.js';
import OTPRouter from './routers/OTPRouter.js';
import tokenRouter from './routers/tokenRouter.js';
import propertyRouter from './routers/propertyRouter.js';
import connectDB from './mongodb/connect.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/otp', OTPRouter);
app.use('/api/v1/tokens', tokenRouter);
app.use('/api/v1/properties', propertyRouter);

const startServer = async (env) => {
    try {
        await connectDB(env.DB_HOST, env.DB_PORT, env.DB_NAME);

        app.listen(env.APP_PORT, () => {
            console.log(`Listening on port ${env.APP_PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

startServer(process.env);