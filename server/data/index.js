const parse = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_insol"] > 0.36
    && planet['koi_prad'] < 1.6
  );
}

fs.createReadStream("Kepler_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (planet) => {
    if (isHabitable(planet)) {
      habitablePlanets.push(planet);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(habitablePlanets.map((planets) => {
      return planets['kepler_name']
    }));
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
