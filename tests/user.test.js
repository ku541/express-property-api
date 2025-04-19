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

test("finds a user", async () => {
  const existingUser = await User.findOne(jane);

  const token = await existingUser.generateToken();

  const response = await request(app)
    .get(`/api/v1/users/${existingUser._id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(StatusCodes.OK);

  expect(response.body._id).toBe(existingUser.id);
});

test("gets all users", async () => {
  const existingUser = await User.findOne(jane);

  const token = await existingUser.generateToken();

  const response = await request(app)
    .get("/api/v1/users")
    .set("Authorization", `Bearer ${token}`)
    .expect(StatusCodes.OK);

  expect(response.body).toHaveProperty("total");
  expect(response.body).toHaveProperty("page");
  expect(response.body).toHaveProperty("limit");
  expect(response.body).toHaveProperty("pages");
  expect(response.body).toHaveProperty("data");
});

test("updates a user", async () => {
  const newName = "Jane Eyre";
  const existingUser = await User.findOne(jane);

  const token = await existingUser.generateToken();

  const response = await request(app)
    .patch("/api/v1/users")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: newName })
    .expect(StatusCodes.OK);

  expect(response.body.name).toBe(newName);
});

afterAll(disconnect);
