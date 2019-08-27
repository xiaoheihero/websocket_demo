#!/usr/bin/env node
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();
var config = {
    "host": "127.0.0.1",
    "port": "3060",
    "timeout": 1000
};
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket client connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            console.log("Send: '" + number + "'");
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, config.timeout);
        }
    }
    sendNumber();
});

client.connect('ws://' + config.server.host + ':' + config.server.port, 'echo-protocol');