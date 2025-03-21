const { User } = require("../../mongodb/models/user.js");

const jane = { name: "Jane Doe", email: "jane@example.com" };

const john = { name: "John Doe", email: "john@example.com" };

const setUpUsers = async () => {
  await User.deleteMany();

  await User.create(jane);
};

module.exports = {
  jane,
  john,
  setUpUsers,
};
