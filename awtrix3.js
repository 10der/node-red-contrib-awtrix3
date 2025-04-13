const fetch = require('node-fetch');

module.exports = function (RED) {
    function Awtrix3Node(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const configNode = RED.nodes.getNode(config.device);
        if (!configNode) {
            node.error("No config node found");
            return;
        }
        const creds = configNode.credentials;

        node.initialized = false;
        node.status({});

        const callApi = function (endpoint, func, err, payload) {
            const url = `http://${configNode.ipaddress}/api/${endpoint}`;
            const options = {
                timeout: 6000,
                method: payload ? 'POST' : 'GET',
                body: payload ? JSON.stringify(payload) : null,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            if (creds && creds.username && creds.username !== undefined) {
                const authHeader = Buffer.from(`${creds.username}:${creds.password}`).toString('base64');
                options.headers.Authorization = `Basic ${authHeader}`;
            }
            fetch(url, options)
                .then((response) => {
                    if (response.ok) {
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            return response.json();
                        }
                        return response.text();
                    }
                    throw new Error('Something went wrong');
                })
                .then((data) => {
                    if (func) {
                        func(data)
                    }
                })
                .catch((error) => {
                    if (err) {
                        err(error);
                    }
                });
        }

        const init = function () {
            callApi('stats',
                function (data) {
                    if (data) {
                        // TODO
                    }
                    node.status({ fill: "green", shape: "dot", text: "initialized" });
                    node.initialized = true;
                },
                function (error) {
                    node.error(error.message, { topic: "init" });
                    node.status({ fill: "red", shape: "dot", text: "not initialized" });

                    // trying to re-init again
                    setTimeout(() => {
                        node.status({ fill: 'yellow', shape: 'ring', text: 'force re-connection' });
                        init();
                    }, 2000);
                },
            );
        };

        const poll = function () {
            if (!node.initialized) {
                return
            }
            // just call poll for a new events
            callApi('stats',
                function (data) {
                    node.send([null, { topic: "stats", payload: data }]);
                },
                function (error) {
                    node.initialized = false;
                    node.error(error.message, { topic: "poll" });
                    node.status({ fill: "red", shape: "dot", text: "error" });
                    // trying to re-init again
                    init();
                },
            );
        }

        const defaultPollerPeriod = 1;
        let pollerPeriod = config.pollingInterval ? parseInt(config.pollingInterval, 1) : defaultPollerPeriod;
        if (Number.isNaN(pollerPeriod) || pollerPeriod < 0 || pollerPeriod > 5) {
            pollerPeriod = defaultPollerPeriod;
        }

        if (this.internalPolling) {
            if (this.poller) { clearTimeout(this.poller); }
            if (pollerPeriod !== 0) {
                this.poller = setInterval(function () {
                    poll();
                }, pollerPeriod * 1000);
            } else {
                this.poller = setInterval(function () {
                    poll(true);
                }, 1 * 1000);
            }
        }

        // init
        node.status({ fill: 'yellow', shape: 'ring', text: 'connection...' });
        init();

        node.on('input', function (msg) {
            const state = ["stats", "settings", "effects", "transitions", "screen", "loop"];
            const topic = msg.topic.toLowerCase();
            if (state.includes(topic)) {
                callApi(topic,
                    function (data) {
                        node.send({ topic, payload: data });
                        node.status({ fill: "green", shape: "dot", text: "connected" });
                    },
                    function (error) {
                        node.error(error.message, { topic });
                        node.status({ fill: "red", shape: "dot", text: "error" });
                    });
            } else {
                callApi(topic,
                    function (data) {
                        node.send({ topic, payload: data });
                        node.status({ fill: "green", shape: "dot", text: "connected" });
                    },
                    function (error) {
                        node.error(error.message, { topic, payload: msg.payload });
                        node.status({ fill: "red", shape: "dot", text: "error" });
                    },
                    msg.payload);
            }
        });
    }

    RED.nodes.registerType("awtrix3", Awtrix3Node, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}
