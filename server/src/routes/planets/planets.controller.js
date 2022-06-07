const planets = require("../../models/planets/planets.model");

function httpGetAllPlanets() {
  res.status(200).json(planets);
}

module.exports = { httpGetAllPlanets };
