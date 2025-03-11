const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRouter = require("./routers/userRouter");
const OTPRouter = require("./routers/OTPRouter");
const tokenRouter = require("./routers/tokenRouter");
const propertyRouter = require("./routers/propertyRouter");
const connectDB = require("./mongodb/connect");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/otp", OTPRouter);
app.use("/api/v1/tokens", tokenRouter);
app.use("/api/v1/properties", propertyRouter);

const startServer = async (env) => {
  try {
    await connectDB(env.DB_HOST, env.DB_PORT, env.DB_NAME);

    app.listen(env.APP_PORT, () => {
      console.log(`Listening on port ${env.APP_PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer(process.env);
