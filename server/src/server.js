const http = require("http");

// env will be populated to all imported files below
require('dotenv').config();

const app = require("./app");
const { loadLaunchData } = require("./models/launches/launches.model");
const { loadPlanetsData } = require("./models/planets/planets.model");
const { mongoConnect } = require("./services/mongo");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

startServer();