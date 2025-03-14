const request = require("supertest");
const { StatusCodes } = require("http-status-codes");

const app = require("../app.js");

const { User } = require("../mongodb/models/user.js");
const { disconnect } = require("../mongodb/connect.js");

const jane = { name: "Jane Doe", email: "jane@example.com" };

const setUpUsers = async () => {
  await User.deleteMany();

  await User.create(jane);
};

beforeEach(setUpUsers);

test("registers a new user", async () => {
  const response = await request(app)
    .post("/api/v1/users")
    .send({ name: "John Doe", email: "john@example.com" })
    .expect(StatusCodes.CREATED);

  expect(response.body).not.toHaveProperty("otp");

  const registeredUser = await User.findById(response.body._id);

  expect(registeredUser).not.toBe(null);
});

test("does not register an existing user", async () => {
  const response = await request(app)
    .post("/api/v1/users")
    .send(jane)
    .expect(StatusCodes.CONFLICT);

  expect(response.body).toHaveProperty("error");
});

afterAll(disconnect);
