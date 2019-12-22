var mysql = require("mysql");
var mqtt = require("mqtt");
const connections = require("./connections");

var sensorIds = {
  vermogen: 1,
  vermogenLeft: 2,
  vermogenRight: 3,
  zon1: 11,
  zon2: 12,
  water: 21,
  gas: 31
};

var client = connections.mqttConnection;
var connection = connections.mysqlConnection;

connection.connect();

client.on("connect", function() {
  client.subscribe("home/+/minutedata", function(err) {
    if (err) {
      console.log(err.message);
    }
  });
  client.subscribe("home/+/setting", function(err) {
    if (err) {
      console.log(err.message);
    }
  });
  client.publish("home/server/dataPusher", "ON");
});

client.on("message", function(topic, m) {
  //console.log(m.toString());
  var message = JSON.parse(m.toString());
  var query = "";

  if (message.type == "minuteData") {
    message.sensors.forEach(sensor => {
      query += `INSERT INTO \`${sensor.sensorName}_minute_data\`(\`id\`, \`data\`, \`timestamp\`) VALUES (NULL, \'${sensor.minuteData}\', FROM_UNIXTIME(${message.time}));`;
    });
  }

  if (message.type == "stat") {
    if (message.sensors) {
    }
    message.sensors.forEach(sensor => {
      query += `INSERT INTO \`sensor_stat\` (\`id\`, \`sensorId\`, \`sensorMin\`, \`sensorMax\`, \`sensorAvg\`,\`timestamp\`) VALUES (NULL,\'${
        sensorIds[sensor.sensorName]
      }\',\'${sensor.sensorMin}\',\'${sensor.sensorMax}\',\'${
        sensor.sensorAvg
      }\',FROM_UNIXTIME(${message.time}));`;
    });
  }

  //console.log(query);
  if (query != "") {
    connection.query(query, function(error) {
      if (error) throw error;
    });
  }
});

function getSensorId(name) {}
