const request = require("supertest");
const { StatusCodes } = require("http-status-codes");

const app = require("../app.js");
const { User } = require("../mongodb/models/user.js");
const { disconnect } = require("../mongodb/connect.js");
const { jane, john, setUpUsers } = require("./fixtures/user.js");

beforeEach(setUpUsers);

test("registers a new user", async () => {
  const response = await request(app)
    .post("/api/v1/users")
    .send(john)
    .expect(StatusCodes.CREATED);

  expect(response.body).not.toHaveProperty("otp");

  const registeredUser = await User.findOne({
    id: response.body._id,
    email: john.email,
  });

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
