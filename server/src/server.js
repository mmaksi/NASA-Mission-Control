const http = require("http");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets/planets.model");
const { mongoConnect } = require("./services/mongo");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
  await mongoConnect();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

startServer();