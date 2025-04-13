
const dgram = require('dgram');

const deviceResolver = []

module.exports = function (RED) {

  function Awtrix3ConfigNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.devices = [];

    if (deviceResolver.length === 0) {
      deviceResolver.push(node);

      const broadcastClient = dgram.createSocket('udp4')
      broadcastClient.on('message', function (message, remote) {
        const index = node.devices.findIndex((item) => item.label === message.toString());
        if (index === -1) {
          node.log(`${remote.address} : ${remote.port} - ${message}`);
          node.devices.push({ label: message.toString(), value: remote.address });
        }
      });
      broadcastClient.on('listening', () => {
        broadcastClient.setBroadcast(true)
        const msg = Buffer.from('FIND_AWTRIX')
        setInterval(() => {
          broadcastClient.send(msg, 4210, '255.255.255.255');
        }, 1000)
      })
      broadcastClient.bind(4211);

      // Register the HTTP endpoint
      RED.httpAdmin.get(`/awtrix3`, (req, res) => {
        res.json(this.devices);
      });
    }

    this.ipaddress = config.ipaddress;
    if (this.credentials) {
      this.login = this.credentials.login;
      this.password = this.credentials.password;
    }
  }

  RED.nodes.registerType('awtrix3-config', Awtrix3ConfigNode, {
    credentials: {
      login: { type: 'text' },
      password: { type: 'password' },
    },
  });
};
