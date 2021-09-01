#!/usr/bin/env node
const express = require("express");
const bodyParser = require("body-parser");
const amqp_connect = require("./amqp_connect");
const EventEmitter = require("events");
var eventEmitter = new EventEmitter();

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

const app = express();
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(express.static("public"));

// rendering html file for api testing
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/sensor.html");
});

app.post("/setdevice", (req, res) => {
  // generating unique id to get the response from rabbitmq
  var correlationId1 = generateUuid();
  var correlationId2 = generateUuid();
  var msg1 = {
    route: "setadevice",
    tokenid: req.body.tokenid,
    deviceID: req.body.deviceID,
  };
  var msg2 = {
    route: "registerdevice",
    tokenid: req.body.tokenid,
    deviceID: req.body.deviceID,
    deviceType: req.body.deviceType,
    days: req.body.days,
    userid: req.body.userid,
    role: req.body.role,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId2, (msg) => {
    // on getting response from rabbitmq
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq device queue
  amqp_connect(eventEmitter, correlationId1, msg1, "device_queue");
  amqp_connect(eventEmitter, correlationId2, msg2, "user_queue");
});

app.post("/getuserdevices", (req, res) => {
  // generating unique id to get the response from rabbitmq
  var correlationId = generateUuid();
  var msg1 = {
    route: "getuserdevices",
    tokenid: req.body.tokenid,
    userid: req.body.userid,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId, (msg) => {
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq device queue
  amqp_connect(eventEmitter, correlationId, msg1, "user_queue");
});

app.post("/getdevice", (req, res) => {
  // generating unique id to get the response from rabbitmq
  var correlationId = generateUuid();
  var msg1 = {
    route: "getdevice",
    tokenid: req.body.tokenid,
    userid: req.body.userid,
    deviceID: req.body.deviceID,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId, (msg) => {
    // generating unique id to get the response from rabbitmq
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq device queue
  amqp_connect(eventEmitter, correlationId, msg1, "user_queue");
});

app.post("/deletedevice", (req, res) => {
  // generating unique id to get the response from rabbitmq
  var correlationId1 = generateUuid();
  var correlationId2 = generateUuid();
  var msg1 = {
    route: "deletedevice",
    tokenid: req.body.tokenid,
    deviceID: req.body.deviceID,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId2, (msg) => {
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq device queue
  amqp_connect(eventEmitter, correlationId1, msg1, "device_queue");
  amqp_connect(eventEmitter, correlationId2, msg1, "user_queue");
});

app.post("/recharge", (req, res) => {
  // generating unique id to get the response from rabbitmq
  var correlationId = generateUuid();
  var msg1 = {
    route: "recharge",
    tokenid: req.body.tokenid,
    userid: req.body.userid,
    deviceID: req.body.deviceID,
    days: req.body.days,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId, (msg) => {
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq device queue
  amqp_connect(eventEmitter, correlationId, msg1, "user_queue");
});

//---------------------------//

app.post("/registeruser", (req, res) => {
  // generating unique id to get the response from rabbitmq
  var correlationId = generateUuid();
  var msg1 = {
    route: "registeruser",
    tokenid: req.body.tokenid,
    userid: req.body.userid,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId, (msg) => {
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq user queue
  amqp_connect(eventEmitter, correlationId, msg1, "user_queue");
});

app.post("/login", (req, res) => {
  // generating unique id to get the response from rabbitmq
  console.log("Test");
  var correlationId = generateUuid();
  var msg1 = {
    route: "login",
    userid: req.body.userid,
    username: req.body.username,
    password: req.body.password,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId, (msg) => {
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq user queue
  amqp_connect(eventEmitter, correlationId, msg1, "user_queue");
});

app.post("/getallusers", (req, res) => {
  // generating unique id to get the response from rabbitmq
  var correlationId = generateUuid();
  var msg1 = {
    route: "getallusers",
    tokenid: req.body.tokenid,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId, (msg) => {
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq user queue
  amqp_connect(eventEmitter, correlationId, msg1, "user_queue");
});

app.post("/getauser", (req, res) => {
  // generating unique id to get the response from rabbitmq
  var correlationId = generateUuid();
  var msg1 = {
    route: "getauser",
    tokenid: req.body.tokenid,
    userid: req.body.userid,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId, (msg) => {
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq user queue
  amqp_connect(eventEmitter, correlationId, msg1, "user_queue");
});

app.post("/istokenvalid", (req, res) => {
  // generating unique id to get the response from rabbitmq
  var correlationId = generateUuid();
  var msg1 = {
    route: "istokenvalid",
    tokenid: req.body.tokenid,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId, (msg) => {
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq user queue
  amqp_connect(eventEmitter, correlationId, msg1, "user_queue");
});

app.post("/deleteuser", (req, res) => {
  // generating unique id to get the response from rabbitmq
  var correlationId = generateUuid();
  var msg1 = {
    route: "deleteuser",
    tokenid: req.body.tokenid,
    userid: req.body.userid,
  };
  // adding an event listener with the unique id
  // to listen events from rabbitmq
  eventEmitter.on(correlationId, (msg) => {
    res.send(JSON.parse(msg));
  });
  // connecting to the rabbitmq user queue
  amqp_connect(eventEmitter, correlationId, msg1, "user_queue");
});

app.listen(5000, function () {
  console.log("listening on port " + 5000);
});

var gracefulExit = function () {
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
};

process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);
