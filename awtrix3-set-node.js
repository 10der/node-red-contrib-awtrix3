module.exports = function (RED) {
    var tools = require('./tools');

    function Awtrix3SetNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        const configNode = RED.nodes.getNode(config.device);
        if (!configNode) {
            node.error("No config node found");
            return;
        }
        const creds = configNode.credentials;

        node.on('input', function (msg) {
            let command = config.command;
            if (command != "msg.topic") {
                msg.payload = null;
                msg.topic = config.command;
                switch (command) {
                    case "power":
                        msg.payload = { "power": config.power == "true" };
                        break;
                    case "sleep":
                        msg.payload = { "sleep": parseInt(config.sleep) };
                        break;
                    case "sound":
                        msg.payload = { "sound": config.sound };
                        break;
                    case "rtttl":
                        msg.payload = { "rtttl": config.rtttl };
                        break;
                    case "moodlight":
                        msg.payload = JSON.parse(config.moodlight);
                        break;
                    case "indicator":
                        msg.topic = `indicator${config.indicator}`;
                        msg.payload = { "color": config.indicator_color };
                        break;
                    case "settings":
                        msg.payload = JSON.parse(config.settings);
                        break;

                    default:
                        console.log(`Sorry, we are out of ${expr}.`);
                }
            } else {
                // allow any raw commands to AWTRIX3
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
    RED.nodes.registerType("awtrix3-set", Awtrix3SetNode);
}