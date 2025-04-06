const request = require("supertest");
const { StatusCodes } = require("http-status-codes");
const { jwtVerify } = require("jose");

const app = require("../app.js");
const { jane, setUpUsers } = require("./fixtures/user.js");
const { User } = require("../mongodb/models/user.js");
const { disconnect } = require("../mongodb/connect.js");

beforeEach(setUpUsers);

test("generates a valid token for a user", async () => {
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

test("does not generate a token when the otp is expired", async () => {
  const existingUser = await User.findOne(jane);

  const expiresAt = new Date();

  expiresAt.setUTCMinutes(expiresAt.getUTCMinutes() - 10);

  existingUser.otp.code = 123456;
  existingUser.otp.expiresAt = expiresAt;

  await existingUser.save();

  const response = await request(app)
    .post("/api/v1/tokens")
    .send({ email: jane.email, otp: existingUser.otp.code })
    .expect(StatusCodes.BAD_REQUEST);

  expect(response.body).toHaveProperty("error");
});

test("does not generate a token when the otp is wrong", async () => {
  const existingUser = await User.findOne(jane);

  await existingUser.generateOTP().save();

  const response = await request(app)
    .post("/api/v1/tokens")
    .send({ email: jane.email, otp: 111111 })
    .expect(StatusCodes.BAD_REQUEST);

  expect(response.body).toHaveProperty("error");
});

afterAll(disconnect);
