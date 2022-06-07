// creating a Map is an implementation detail that only the model knows about
const launches = new Map();

let latestFlightNumber = 100;

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

launches.set(launch.flightNumber, launch)

function existsLaunchWithId(launchId) {
  return launches.has(launchId)
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      upcoming: true,
      success: true,
      customers: ["Mark Maksi", "NASA"],
    })
  );
}

function abortLaunchById(launchId) {
  const abortedLaunch = launches.get(launchId)
  abortedLaunch.upcoming = false
  abortedLaunch.success = false
  return abortedLaunch
}

module.exports = {
  launches,
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById
};
