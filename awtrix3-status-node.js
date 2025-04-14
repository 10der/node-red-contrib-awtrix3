module.exports = function (RED) {
    function Awtrix3StatusNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            msg.payload = null;
            const state = ["stats", "settings", "effects", "transitions", "screen", "loop"];
            let command = config.command;
            if ( command !== "msg.topic") {
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
            node.send(msg);
        });
    }
    RED.nodes.registerType("awtrix3-status", Awtrix3StatusNode);
}