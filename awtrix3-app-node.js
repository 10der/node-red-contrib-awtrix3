module.exports = function (RED) {
    var tools = require('./tools');
    
    function Awtrix3AppNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', async function (msg) {
            msg.payload = msg.payload || {};
            msg.topic = `custom?name=${(config.name || node.id)}`;
            const options = { ...JSON.parse(config.application), ...msg.payload };
            // https://developer.lametric.com/content/apps/icon_thumbs/33655
            let app = {
            };
            let payload = { ...app, ...options };
            if (payload.icon) {
                if (payload.icon.startsWith('http')) {
                    const iconFile = await tools.getIcon(payload.icon);
                    payload.icon = iconFile;
                }
            }
            msg.payload = payload;
            node.send(msg);
        });

    }
    RED.nodes.registerType("awtrix3-app", Awtrix3AppNode);
}