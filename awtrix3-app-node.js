module.exports = function (RED) {
    function Awtrix3AppNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            msg.payload = msg.payload || {};
            msg.topic = `custom?name=${(config.name||node.id)}`;
            const options = {...JSON.parse(config.application), ...msg.payload};
            if (false) {
                msg.payload = null
            } else {
                // https://developer.lametric.com/content/apps/icon_thumbs/33655
                let app = {
                };                
                msg.payload = { ...app, ...options };
            }
            node.send(msg);
        });

    }
    RED.nodes.registerType("awtrix3-app", Awtrix3AppNode);
}