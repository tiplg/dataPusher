//add corrent credentials and rename to connections.js

var mysql = require("mysql");
var mqtt = require("mqtt");

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "password",
  database: "database"
});

var mqttConnection = mqtt.connect("mqtt://localhost:1883");

module.exports = {
  mysqlConnection,
  mqttConnection
};
