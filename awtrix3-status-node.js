var Awtrix3Device = require('./tools');

module.exports = function (RED) {
    function Awtrix3StatusNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        const configNode = RED.nodes.getNode(config.device);
        if (!configNode) {
            node.error("No config node found");
            return;
        }
        const creds = configNode.credentials;

        node.status({ fill: "yellow", shape: "ring", text: "Loading..." });
        this.device = new Awtrix3Device(configNode.ipaddress, creds);
        this.device.on('ready', function () {
            node.status({ fill: "green", shape: "dot", text: "ready" });
            setTimeout(() => {
                node.status({});
            }, 5000);
        });
        this.device.on('error', function (error, topic, request, response) {
            node.status({ fill: "red", shape: "ring", text: "error" });
            node.error(error.message, { topic: topic, payload: response, request: request });
        });
        this.device.on('payload', function (topic, request, response) {
            node.send({ topic: topic, payload: response, request: request });
            node.status({ fill: "green", shape: "dot", text: "ok" });
        });

        node.on('input', function (msg) {
            msg.payload = null;
            const state = ["stats", "settings", "effects", "transitions", "screen", "loop"];
            let command = config.command;
            if (command !== "msg.topic") {
                msg.topic = command;
            } else {
                command = msg.topic;
                if (state.includes(command)) {
                    msg.topic = command;
                } else {
                    node.status({ fill: "red", shape: "dot", text: "error" });
                    node.error("Invalid command: " + command);
                    setTimeout(() => {
                        node.status({});
                    }, 5000);
                    return;
                }
            }

            node.status({ fill: 'green', shape: 'dot', text: 'triggered...' });
            setTimeout(() => {
                node.status({});
            }, 5000);

            this.device.callApi(msg.topic, msg.payload);
        });
    }
    RED.nodes.registerType("awtrix3-status", Awtrix3StatusNode);
}