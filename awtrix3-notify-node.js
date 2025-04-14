module.exports = function (RED) {
    function Awtrix3NotifyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            msg.payload = msg.payload || {};
            const options = {...JSON.parse(config.options), ...msg.payload};
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
                msg.payload = { ...notification, ...options };
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("awtrix3-notify", Awtrix3NotifyNode);
}