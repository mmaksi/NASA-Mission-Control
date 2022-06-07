const {getAllPlanets} = require("../../models/planets/planets.model");

function httpGetAllPlanets(req, res) {
  res.status(200).json(getAllPlanets());
}

module.exports = { httpGetAllPlanets };
