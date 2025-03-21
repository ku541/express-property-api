const request = require("supertest");
const { StatusCodes } = require("http-status-codes");

const app = require("../app.js");
const { jane, setUpUsers } = require("./fixtures/user.js");
const { User } = require("../mongodb/models/user.js");
const { disconnect } = require("../mongodb/connect.js");

jest.mock("../mail/nodemailer.js");

beforeEach(setUpUsers);

test("generates a valid otp for a user", async () => {
  const response = await request(app)
    .post("/api/v1/otp")
    .send({ email: jane.email })
    .expect(StatusCodes.CREATED);

  expect(response.body).toHaveProperty("message");

  const otpGeneratedUser = await User.findOne(jane);

  expect(otpGeneratedUser).toHaveProperty("otp");
  expect(otpGeneratedUser.otp.expiresAt.getTime()).toBeGreaterThan(
    new Date().getTime()
  );
});

afterAll(disconnect);
