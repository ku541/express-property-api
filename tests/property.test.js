const request = require("supertest");
const { StatusCodes } = require("http-status-codes");

const app = require("../app.js");
const { User } = require("../mongodb/models/user.js");
const { jane, setUpUsers } = require("./fixtures/user.js");
const { disconnect } = require("../mongodb/connect.js");

jest.mock("../helpers/image.js", () => {
  const originalModule = jest.requireActual("../helpers/image.js");

  return {
    ...originalModule,
    optimize: jest.fn(),
    configureCloudinary: jest.fn(),
    uploadAndCleanUp: jest.fn(() => "https://placehold.co/600x400"),
    destroy: jest.fn(),
  };
});

beforeEach(setUpUsers);

test("creates a property", async () => {
  const existingUser = await User.findOne(jane);

  const token = await existingUser.generateToken();

  const response = await request(app)
    .post("/api/v1/properties")
    .field("title", "Janes")
    .field("description", "Janes House")
    .field("type", "Residence")
    .field("location", "New York")
    .field("price", 1000000)
    .attach("image", "tests/fixtures/property.jpg")
    .set("Authorization", `Bearer ${token}`)
    .expect(StatusCodes.CREATED);
  console.log(response.body);

  expect(response.body.owner).toBe(existingUser.id);
});

afterAll(disconnect);
