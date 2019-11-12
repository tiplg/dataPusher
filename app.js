var mysql = require("mysql");
var mqtt = require("mqtt");
const connections = require("./connections");

var client = connections.mqttConnection;
var connection = connections.mysqlConnection;

connection.connect();

client.on("connect", function() {
  client.subscribe("home/+/minuteData", function(err) {
    if (!err) {
      client.publish("home/server/dataPusher", "ON");
    }
  });
});

client.on("message", function(topic, message) {
  let query = `INSERT INTO \`${
    topic.split("/")[1]
  }_data\` (\`id\`, \`minute_value\`, \`timestamp\`) VALUES (NULL, \'${message.toString()}\', NOW())`;
  connection.query(query, function(error) {
    if (error) throw error;
    console.log(topic.split("/")[1] + ": " + message.toString());
  });
});
