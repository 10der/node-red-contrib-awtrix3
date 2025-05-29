module.exports = function (RED) {
    var tools = require('./tools');
    var Mustache = require('mustache');

    function Awtrix3AppNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        const configNode = RED.nodes.getNode(config.device);
        if (!configNode) {
            node.error("No config node found");
            return;
        }
        const creds = configNode.credentials;

        node.on('input', async function (msg) {
            msg.payload = msg.payload || {};
            msg.topic = `custom?name=${(config.name || node.id)}`;
            var output = Mustache.render(config.application, { msg: msg });
            const options = { ...JSON.parse(output), ...msg.payload };
            // https://developer.lametric.com/content/apps/icon_thumbs/33655
            let app = {
            };
            let payload = { ...app, ...options };
            if (payload.icon) {
                payload.icon = payload.icon.toString();
                if (payload.icon.startsWith('http')) {
                    const iconFile = await tools.getIcon(payload.icon);
                    payload.icon = iconFile;
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

    RED.nodes.registerType("awtrix3-app", Awtrix3AppNode);
}