module.exports = function (RED) {
    function Awtrix3SetNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            const state = ["power", "sleep", "sound", "rtttl", "moodlight",
                "indicator", "indicator1", "indicator2", "indicator3", "settings"];
            msg.topic = config.command;
            let command = config.command;
            msg.payload = null;
            if (command != "msg.topic") {
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
            node.send(msg);
        });
    }
    RED.nodes.registerType("awtrix3-set", Awtrix3SetNode);
}