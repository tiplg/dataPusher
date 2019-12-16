var mysql = require("mysql");
var mqtt = require("mqtt");
const connections = require("./connections");

var client = connections.mqttConnection;
var connection = connections.mysqlConnection;

connection.connect();

client.on("connect", function() {
  client.subscribe("home/+/minutedata", function(err) {
    if (!err) {
      client.publish("home/server/dataPusher", "ON");
    }
  });
});

client.on("message", function(topic, m) {
  //console.log(m.toString());
  var message = JSON.parse(m.toString());

  if (message.type == "minuteData") {
    var query = "";
    message.sensors.forEach(sensor => {
      query += `INSERT INTO \`${sensor.sensorName}_minute_data\`(\`id\`, \`data\`, \`timestamp\`) VALUES (NULL, \'${sensor.minuteData}\', FROM_UNIXTIME(${message.time}));`;
    });
  }

  //console.log(query);

  connection.query(query, function(error) {
    if (error) throw error;
  });
});
