const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const mongoUri = `mongodb+srv://jaswant_ameotech:${dbConfig.Password}@cluster0.qm1rks6.mongodb.net/?retryWrites=true&w=majority`;
db.mongoose
  // .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Ameo hrm application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/profile.routes")(app);
require("./app/routes/leave.routes")(app);
require("./app/routes/attendance.routes")(app);
require("./app/routes/inventory.routes")(app);
require("./app/routes/vacancy.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "leader",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'leader' to roles collection");
      });
      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

function chat() {
  let users = [];
  var roomno = 1;

  io.on("connection", (socket) => {
    socket.join("Ameo-" + roomno);

    socket.on("message", (data) => {
      io.emit("messageResponse", data);
    });

    socket.on("typing", (data) => {
      socket.broadcast.emit("typingResponse", data);
    });

    socket.on("newUser", (data) => {
      users.push(data);
      io.emit("newUserResponse", users);
    });

    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
      users = users.filter((user) => user.socketID !== socket.id);
      io.emit("newUserResponse", users);
      socket.disconnect();
    });
  });
}

chat();

/*app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});*/

server.listen(PORT, () => {
  console.log("listening on *:3000");
});
