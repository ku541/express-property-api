import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import connectDB from "./mongodb/connect.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.send({ message: 'Hello' });
});

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