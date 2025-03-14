const { env } = require("node:process");

const app = require("./app.js");

const port = env.APP_PORT || 3000;

app.listen(port, () => console.info(`Listening on port ${port}`));
