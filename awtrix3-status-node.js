module.exports = function (RED) {
    var tools = require('./tools');

    function Awtrix3StatusNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        const configNode = RED.nodes.getNode(config.device);
        if (!configNode) {
            node.error("No config node found");
            return;
        }
        const creds = configNode.credentials;

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

            send(msg);
        });

        const send = function (msg) {
            tools.callApi(configNode.ipaddress, msg.topic, creds,
                function (data) {
                    node.send({ topic: msg.topic, payload: data, request: msg.payload });
                    node.status({ fill: "green", shape: "dot", text: "ok" });
                },
                function (error) {
                    node.error(error.message, { topic: msg.topic, payload: msg.payload });
                    node.status({ fill: "red", shape: "dot", text: "error" });
                },
                msg.payload);
        }
    }
    RED.nodes.registerType("awtrix3-status", Awtrix3StatusNode);
}