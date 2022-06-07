const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const habitablePlanets = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  try {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
          delimiter: ",",
        })
      )
      .on("data", (planet) => {
        if (isHabitable(planet)) {
          habitablePlanets.push(planet);
        }
      })
      .on("error", (err) => {
        throw Error
      })
      .on("end", () => {
        console.log(
          habitablePlanets.map((planet) => {
            return planet["kepler_name"];
          })
        );
        console.log(`${habitablePlanets.length} habitable planets found!`);
      });
  } catch (error) {
    console.log("Can't get planets");
  }
}

module.exports = { loadPlanetsData, planets: habitablePlanets };
