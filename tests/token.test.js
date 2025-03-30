const request = require("supertest");
const { StatusCodes } = require("http-status-codes");
const { jwtVerify } = require("jose");

const app = require("../app.js");
const { jane, setUpUsers } = require("./fixtures/user.js");
const { User } = require("../mongodb/models/user.js");
const { disconnect } = require("../mongodb/connect.js");

beforeEach(setUpUsers);

test("tokens", async () => {
  const existingUser = await User.findOne(jane);

  await existingUser.generateOTP().save();

  const response = await request(app)
    .post("/api/v1/tokens")
    .send({ email: jane.email, otp: existingUser.otp.code })
    .expect(StatusCodes.CREATED);

  expect(response.body).toHaveProperty("token");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const { payload } = await jwtVerify(response.body.token, secret);

  expect(payload._id).toBe(existingUser.id);
});

afterAll(disconnect);
