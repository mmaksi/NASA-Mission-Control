const {planets} = require("../../models/planets/planets.model");

function httpGetAllPlanets(req, res) {
  res.status(200).json(planets);
}

module.exports = { httpGetAllPlanets };
