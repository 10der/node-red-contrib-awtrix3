module.exports = function (RED) {
    var tools = require('./tools');

    function Awtrix3NotifyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', async function (msg) {
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
                let payload = { ...notification, ...options };
                if (payload.icon) {
                    if (payload.icon.startsWith('http')) {
                        const iconFile = await tools.getIcon(payload.icon);
                        payload.icon = iconFile;
                    }
                }
                msg.payload = payload;
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("awtrix3-notify", Awtrix3NotifyNode);
}