module.exports = function (RED) {
    var tools = require('./tools');
       var Mustache = require('mustache');

    function Awtrix3NotifyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', async function (msg) {
            msg.payload = msg.payload || {};
            var output = Mustache.render(config.options, { msg: msg });
            const options = {...JSON.parse(output), ...msg.payload};
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