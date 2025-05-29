var Awtrix3Device = require('./tools');

module.exports = function (RED) {
    var Mustache = require('mustache');

    function Awtrix3NotifyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        const configNode = RED.nodes.getNode(config.device);
        if (!configNode) {
            node.error("No config node found");
            return;
        }
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

        node.on('input', async function (msg) {
            msg.payload = msg.payload || {};
            var output = Mustache.render(config.options, { msg: msg });
            const options = { ...JSON.parse(output), ...msg.payload };
            if (!config.text && !config.icon) {
                msg.topic = "notify/dismiss";
                msg.payload = null
            } else {
                // https://developer.lametric.com/content/apps/icon_thumbs/33655
                let notification = {
                    text: config.text,
                    icon: config.icon,
                };
                msg.topic = "notify";
                let payload = { ...notification, ...options };
                if (payload.icon) {
                    payload.icon = payload.icon.toString();
                    if (payload.icon.startsWith('http')) {
                        const iconFile = await this.device.getIcon(payload.icon);
                        payload.icon = iconFile;
                    }
                }
                msg.payload = payload;
            }

            node.status({ fill: 'green', shape: 'dot', text: 'triggered...' });
            setTimeout(() => {
                node.status({});
            }, 5000);

            this.device.callApi(msg.topic, msg.payload);
        });
    }
    RED.nodes.registerType("awtrix3-notify", Awtrix3NotifyNode);
}