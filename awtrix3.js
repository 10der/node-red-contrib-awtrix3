module.exports = function (RED) {
    var tools = require('./tools');

    function Awtrix3Node(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const configNode = RED.nodes.getNode(config.device);
        if (!configNode) {
            node.error("No config node found");
            return;
        }
        const creds = configNode.credentials;

        node.initialized = false;
        node.status({});

        const init = function () {
            tools.callApi(configNode.ipaddress, 'stats', creds,
                function (data) {
                    if (data) {
                        // TODO
                    }
                    node.status({ fill: "green", shape: "dot", text: "initialized" });
                    node.initialized = true;
                },
                function (error) {
                    node.error(error.message, { topic: "init" });
                    node.status({ fill: "red", shape: "dot", text: "not initialized" });
                },
            );
        };

        // init
        node.status({ fill: 'yellow', shape: 'ring', text: 'connection...' });
        init();

        node.on('input', function (msg) {
            const state = ["stats", "settings", "effects", "transitions", "screen", "loop"];
            const topic = msg.topic.toLowerCase();
            if (!msg.payload && state.includes(topic)) {
                tools.callApi(configNode.ipaddress, topic, creds,
                    function (data) {
                        node.send({ topic, payload: data, request: msg.payload });
                        node.status({ fill: "green", shape: "dot", text: "connected" });
                    },
                    function (error) {
                        node.error(error.message, { topic });
                        node.status({ fill: "red", shape: "dot", text: "error" });
                    });
            } else {
                tools.callApi(configNode.ipaddress, topic, creds,
                    function (data) {
                        node.send({ topic, payload: data, request: msg.payload });
                        node.status({ fill: "green", shape: "dot", text: "connected" });
                    },
                    function (error) {
                        node.error(error.message, { topic, payload: msg.payload });
                        node.status({ fill: "red", shape: "dot", text: "error" });
                    },
                    msg.payload);
            }
        });
    }

    RED.nodes.registerType("awtrix3", Awtrix3Node, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}
