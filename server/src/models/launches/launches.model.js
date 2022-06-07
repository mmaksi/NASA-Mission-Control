const launchesModel = require("./launches.mongo");
const planetsModel = require("../planets/planets.mongo");

// creating a Map is an implementation detail that only the model knows about
// const launches = new Map();

let DEFAULT_FLIGHT_NUMBER;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2022"),
  target: "Kepler-442 b",
  customers: ["Mark Maksi", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await launchesModel.findOne({ flightNumber: launchId }, { __v: 0, _id: 0 });
}

async function getAllLaunches() {
  return await launchesModel.find({}, { __v: 0, _id: 0 });
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    upcoming: true,
    success: true,
    customers: ["Mark Maksi", "NASA"],
  });
  return await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesModel.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );

  return aborted.modifiedCount === 1 && aborted.matchedCount === 1;
}

// Mongoose methods layer
async function saveLaunch(launch) {
  const planet = await planetsModel.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("No matching planet found");
  }
  await launchesModel.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesModel.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
