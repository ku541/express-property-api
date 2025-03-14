require("dotenv").config();
const { env } = require("node:process");

const express = require("express");
const cors = require("cors");

const userRouter = require("./routers/userRouter.js");
const OTPRouter = require("./routers/OTPRouter.js");
const tokenRouter = require("./routers/tokenRouter.js");
const propertyRouter = require("./routers/propertyRouter.js");
const { connect } = require("./mongodb/connect.js");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/otp", OTPRouter);
app.use("/api/v1/tokens", tokenRouter);
app.use("/api/v1/properties", propertyRouter);

(async () => await connect(env.DB_HOST, env.DB_PORT, env.DB_NAME))();

module.exports = app;
