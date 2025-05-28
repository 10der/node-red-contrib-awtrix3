module.exports = function (RED) {
    var tools = require('./tools');
    var Mustache = require('mustache');

    function Awtrix3AppNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
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
            msg.payload = payload;
            node.send(msg);
        });

    }
    RED.nodes.registerType("awtrix3-app", Awtrix3AppNode);
}