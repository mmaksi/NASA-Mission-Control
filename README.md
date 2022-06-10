# NASA Mission Control Project
The Front End of this application is made by NASA and it is an unofficial mission control system made for educational purposes only. The API is created using Node.js and Express.js
The planets data populated to the Front End is taken from the official [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/docs/data.html). This data is filtered out based on [habitable planets criteria](https://www.centauri-dreams.org/2015/01/30/a-review-of-the-best-habitable-planet-candidates/) which are Stellar Flux between 0.36 and 1.11, Planetary Radius less than 1.6 times that of Earth. All the results match the list of [Habitable Exoplanets Catalog](http://phl.upr.edu/projects/habitable-exoplanets-catalog) along with other habitable exoplanets from other telescopes other than Kepler, and Kepler-442b [is more habitable than Earth](wired.co.uk/article/kepler-442b-more-habitable-earth)!!

![nasa-mission-control-dashboard](https://i.ibb.co/6BJXc9h/nasa-mission-control.png)

# NASA Mission Control Dashboard Architecture
![nasa-project-architecture](https://i.ibb.co/chmRMS6/architecture.png)

# 1. Node.js Fundamentals - Foundations & Internals
- You need a runtime to run JavaScript. Eg.: browsers, node.js and deno.
- node.js is a JavaScript runtime built on Chrome's V8 JavaScript Engine.
- Ryan Dahl created the _node.js bindings_ that are responsible for comunication between the V8 Engine for synchronous tasks and Libuv for asynchronous I/O tasks (it uses parts of the OS, mainly the Kernel).
- Node.js provides `global` object instead of `window` object in the browser.
- Opening a file in Windows differs from Linux and from MacOS. Libuv can handle this task using the `path` function from the Node.js API, making Node.js working on any OS!
- Node.js API functions are handled by Libuv to handle asynchronous I/O tasks, making Node.js non-blocking.
![node-internals](https://i.ibb.co/7RH9p0G/node-runtime.png)

### Is Node.js Multi Threaded?!
- The CPU handles asynchronous tasks by using multiple threads. But for any process (program) to make use of the CPU threads, the programming language of that process must support multi-threaded programming.
- JavaScript is a single threaded language. So how do Node.js processes allow us to open files and make http requests asynchronously?
- In node, we have one main thread that runs the V8 Engine.
- Synchronous JavaScript runs on the main thread. Asynchrounous JavaScript runs on the Event Loop of Libuv
- Libuv Event Loop delegates asynchronous code _either_ to the OS Kernel directly _or_ to the Thread Pool (Libuv is written in C language and it supports threads).
- The OS Kernel has multi threads of its own. So node.js actively tries to avoid delegating asynchronous code to the Thread Pool and instead, it uses the OS threads.
- The internals of Libuv (Event Loop, Thread Pool and talking to OS threads) is what makes node.js non-blocking I/O.

### Libuv - The Event Loop
- It handles all callback functions that allow node to execute code asynchrnously until it has nothing to execute.
- The callback queue works in first in first out mode.

### Observer Design Pattern
- Much of the Node.js core API is built upon an async event-driven architecture in which _emitters_ emmit _events_ that cause callback functions called _listeners_ to be called.
- Use the `event` node module to create _subjects_ who can emit _events_ that can be listened to from _subscribers_ using the `on` method.

# NASA Project API Notes
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

# Databases - MongoDB and Mongoose
- MongoDB has _documents_ orhanized into _collections_.
- Documents in noSQL DBs include all related data together while they are seperated apart in tables in SQL DBs.
- MongoDB provide horizontal scaling while SQL verticle scaling.
- MongoDB's Schema (structure of data in the DB) is _flexible_ while in postgres it is rigid.
![sql-vs-nosql](https://i.ibb.co/mN7Xqj7/schema.png)

- MongoDB stores data in BSON format in _documents_ inside _collections_. Mongo itself doesn't enforce schemas.
- We query Mongo collections using mongoose _models_.
- mongoose provides mongodb _object modeling_ for node.js. This means that querying mongoose models return JavaScript objects.
**Note**
Always export mongoose models to MVC models
![mongoose-and-mongodb](https://i.ibb.co/3s3YVz3/mongodb.png)

- Upsert operation finds the document that matches the filter. If it exists it updates it with the `update` object. If it doesn't it creates a new document.
```
await planetsModel.findOneAndUpdate(filter, update, {upsert: true})
```
- MongoDB adds `_id` to each document because MongoDB is designed to work in a horizontally scalable way. Thus we want a unique document id across all of node processes in the cluster.
- The ObjectId in MongoDB represents the date and time the document was created in a random-like way.
- Mongoose creates a _version key_ as `__v` for each document. You can exclude `__v` and `_id` by passing a _projection object_ to the `find` operation as `{"__v": 0, "_id": 0}` :
```
await planetsModel.find(filter, projection)
```
### Auto Incrememnting in MongoDB
1. Step1: Find the latest document: `launchesModel.findOne().sort({ flightNumber: -1 })`
2. Step2: Add one

# Continuous Integration and Delivery
## Continuous Integration
- Frequently committing code to a shared repository.
- CI server detects changes made to the shared repository, builds, tests and reprots back to the development team.
- Inspired by Agile.

## Continuous Delivery
- It gurantees that each code pushed to the main branch is ready to be delivered.
- Gives you confidence that your software can be released to users at any point in time.
- Acceptance tests made by QA teams in addition to UI tests.
- It is best practice for both the backend and frontend.
- Automatically release to the repository.

## Continuous Deployment
**Note**
- Continuous Deployment is not for every product because some products like health-related products involve many manual procsesses that are very senisitve and very hard to automate.
- Automatically deploy to production.

## Pipelines
- A pipeline is a set of steps that need to complete as part of CI process.

# Node Production and The Cloud (Docker + AWS)
You can deploy to the cloud using one of these methods:
1. Serverless - The cloud manages the configuration of the servers like AWS Functions
2. Containers

- Images are snapshots of our files for containers' applications to run
- Images are immutable
- `docker run -d -p 80:80 docker/getting-started` -p maps a port from the container to the computer.
- Dockerfile allows us to take a base image and run a series of instructions on top of that base image
- Docker builds an image usin `docker build` based on the Dockerfile created, and then executes this image in a container using `docker run` command.