var Awtrix3Device = require('./tools');

module.exports = function (RED) {
    function Awtrix3Node(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const configNode = RED.nodes.getNode(config.device);
        if (!configNode) {
            node.error("No config node found");
            return;
        }``
        const creds = configNode.credentials;

        node.status({fill:"yellow", shape:"ring", text:"Loading..."});
        this.device = new Awtrix3Device(configNode.ipaddress, creds);
        this.device.on('ready', function() {
            node.status({ fill: "green", shape: "dot", text: "ready" });
            setTimeout(() => {
                node.status({});
            }, 5000);
        });
        this.device.on('error', function(error, topic, request, response) {
            node.status({ fill: "red", shape: "ring", text: "error" });
            node.error(error.message, { topic: topic, payload: response, request: request });
        });
        this.device.on('payload', function(topic, request, response) {
            node.send({ topic: topic, payload: response, request: request });
            node.status({ fill: "green", shape: "dot", text: "ok" });
        });    

        node.on('input', function (msg) {
            node.status({ fill: 'green', shape: 'dot', text: 'triggered...' });
            setTimeout(() => {
                node.status({});
            }, 5000);

            this.device.callApi(msg.topic, msg.payload);
        });
    }
    RED.nodes.registerType("awtrix3", Awtrix3Node);
}
