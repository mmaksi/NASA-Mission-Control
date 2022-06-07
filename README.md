# NASA Mission Control Project
The Front End of this application is made by NASA and it is an unofficial mission control system made for educational purposes only. The API is created using Node.js and Express.js
The planets data populated to the Front End is taken from the official [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/docs/data.html). This data is filtered out based on [habitable planets criteria](https://www.centauri-dreams.org/2015/01/30/a-review-of-the-best-habitable-planet-candidates/) which are Stellar Flux between 0.36 and 1.11, Planetary Radius less than 1.6 times that of Earth. All the results match the list of [Habitable Exoplanets Catalog](http://phl.upr.edu/projects/habitable-exoplanets-catalog) along with other habitable exoplanets from other telescopes other than Kepler, and Kepler-442b [is more habitable than Earth](wired.co.uk/article/kepler-442b-more-habitable-earth)!!

![nasa-mission-control-dashboard](https://i.ibb.co/6BJXc9h/nasa-mission-control.png)

# Notes and Lessons
- Node File System module has no idea what CSV files are. It will treat it like a text file.
- In Node all streams are implemented using the Event Emitter where the events are emitted by node as streams and we react on those events.
- You seperate models from the controllers because one model can be used by different controllers or multiple models used by the same controller. For example, the planets model can be used by in the launches controller or stars model in planets controller.
- Valid Date objects return true when `isNaN(Date())`. You can use this to validate incoming date input.
- Always validate user input.

### Middlewares
- Middlewares are functions that take 3 parameters: `function (req, res, next) {}` and they are used to handle requests before passing them to the appropriate endpoint. You can set middlewares on the entire application: `app.use((req, res, next) => {})` or on a specific route.

- Most Express projects use the MVC (Model, View, Controller) design pattern to design the architecture of the API. The user uses the `Controller` to manipulate the `Model` which in turn updates the `View`.

- `Models` transform the data in a way that is needed by the controller by creating Data Access Layers for the controllers.

- Seperating routers into specific folders allow you to add middlewares to these specific routers.

### Why do you we use stream API made available by csv-parse to handle the Kepler Data?
- Streams allow us to deal with large data sets as they are read by the hard drive line by line before waiting for the entire data to be loaded before doing anything with it.
- We create a stream by using `fs.createReadStream()` then we pass the readable stream to `parse()` using `readableStream.pipe(writeableStream)` to parse the stream and create a JavaScript object.

### Rest APIs
1. Use existing standards (HTTP, JSON, URL)
2. Endpoints are collections of data on the server side
3. Use GET, POST, PUT and DELETE to deal with the endpoints
4. Client/Server design
5. Requests are stateless and cacheable (not related to any state on the client like a user session)

### CORS middleware
When the client is listening on a different port than the server, you get CORS error if you tried to fetch data from that server.

### Populate data to the server on startup
You must `await` for `async` functions like `try {} catch {}` to return before exporting or dealing with the data that should be provided

### Scripting
- `npm install --prefix server` will install dependencies in the server directory
- `script1 && script2` will execute script2 after script1 finishes executing
- `script1 & script2` will execute both script1 and script2 in the background
- `set BUILD_PATH=../server/public&& react-scripts build` will build inside the server directory so that you serve the frontend and the backend on one port

### Logging incoming requests
Use `morgan` middleware to log all incoming requests

### Handling fetch() errors
The `fetch()` function returns `{ ok: true }` on the `response` object if there was no error. And it should *explicitly* return `{ ok: false }` in the catch statement.
