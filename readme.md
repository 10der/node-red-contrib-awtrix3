#node-red-contrib-awtrix3
[![npm version](https://badge.fury.io/js/node-red-contrib-awtrix3.svg)](https://badge.fury.io/js/node-red-contrib-awtrix3)
[![Downloads](https://img.shields.io/npm/dt/node-red-contrib-awtrix3)](https://www.npmjs.com/package/node-red-contrib-awtrix3)
[![Buy me a cofee](https://cdn.buymeacoffee.com/buttons/default-orange.png)](https://www.buymeacoffee.com/10der)

========================

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-contrib-awtrix3

Usage
-----

![sample](https://raw.githubusercontent.com/10der/node-red-contrib-awtrix3/master/example.png)


Example
-------

```
[
    {
        "id": "15d75fd54c8072af",
        "type": "tab",
        "label": "Flow 1",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "50dad4a6014e2bba",
        "type": "awtrix3",
        "z": "15d75fd54c8072af",
        "name": "test awtrix3",
        "device": "ed90e36223ed7600",
        "x": 490,
        "y": 100,
        "wires": [
            [
                "c3feef03da680473"
            ]
        ]
    },
    {
        "id": "ac2a4a6a6604be26",
        "type": "debug",
        "z": "15d75fd54c8072af",
        "name": "debug 1",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 800,
        "y": 80,
        "wires": []
    },
    {
        "id": "650a6a88c8e101a2",
        "type": "inject",
        "z": "15d75fd54c8072af",
        "name": "test error",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "test",
        "payload": "",
        "payloadType": "str",
        "x": 340,
        "y": 40,
        "wires": [
            [
                "50dad4a6014e2bba"
            ]
        ]
    },
    {
        "id": "7f55e3d47c1309b8",
        "type": "debug",
        "z": "15d75fd54c8072af",
        "name": "debug 2",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 800,
        "y": 120,
        "wires": []
    },
    {
        "id": "c3feef03da680473",
        "type": "switch",
        "z": "15d75fd54c8072af",
        "name": "",
        "property": "topic",
        "propertyType": "msg",
        "rules": [
            {
                "t": "eq",
                "v": "stats",
                "vt": "str"
            },
            {
                "t": "else"
            }
        ],
        "checkall": "true",
        "repair": false,
        "outputs": 2,
        "x": 630,
        "y": 100,
        "wires": [
            [
                "ac2a4a6a6604be26"
            ],
            [
                "7f55e3d47c1309b8"
            ]
        ]
    },
    {
        "id": "75f21cf0a0fe251b",
        "type": "catch",
        "z": "15d75fd54c8072af",
        "name": "",
        "scope": null,
        "uncaught": false,
        "x": 480,
        "y": 40,
        "wires": [
            [
                "85c626a5fdae6b8c"
            ]
        ]
    },
    {
        "id": "85c626a5fdae6b8c",
        "type": "debug",
        "z": "15d75fd54c8072af",
        "name": "debug 3",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 640,
        "y": 40,
        "wires": []
    },
    {
        "id": "c177c0c52b3bd03b",
        "type": "awtrix3-status",
        "z": "15d75fd54c8072af",
        "name": "",
        "command": "loop",
        "x": 270,
        "y": 140,
        "wires": [
            [
                "50dad4a6014e2bba"
            ]
        ]
    },
    {
        "id": "4829a2fc9d9a1191",
        "type": "inject",
        "z": "15d75fd54c8072af",
        "name": "custom",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "screen",
        "payload": "",
        "payloadType": "date",
        "x": 90,
        "y": 140,
        "wires": [
            [
                "c177c0c52b3bd03b"
            ]
        ]
    },
    {
        "id": "b18f3191c7ee050a",
        "type": "awtrix3-set",
        "z": "15d75fd54c8072af",
        "name": "",
        "command": "indicator",
        "power": "true",
        "sleep": "10",
        "sound": "beep",
        "rtttl": "two_short:d=4,o=5,b=100:16e6,16e6",
        "moodlight": "{\"brightness\":170,\"color\":\"#FF00FF\"}",
        "indicator": "2",
        "indicator_color": "#FF0000",
        "settings": "{\"WD\":true,\"TIME_COL\":[255,255,255],\"TCOL\":[255,255,255],\"TMODE\":1,\"ABRI\":true,\"ATRANS\":true}",
        "x": 280,
        "y": 200,
        "wires": [
            [
                "50dad4a6014e2bba"
            ]
        ]
    },
    {
        "id": "411b95d1a1363456",
        "type": "inject",
        "z": "15d75fd54c8072af",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 100,
        "y": 200,
        "wires": [
            [
                "b18f3191c7ee050a"
            ]
        ]
    },
    {
        "id": "39961376d55bb433",
        "type": "awtrix3-set",
        "z": "15d75fd54c8072af",
        "name": "",
        "command": "settings",
        "power": "true",
        "sleep": "1000",
        "sound": "beep",
        "rtttl": "two_short:d=4,o=5,b=100:16e6,16e6",
        "moodlight": "{\"brightness\":170,\"color\":\"#FF00FF\"}",
        "indicator": "1",
        "indicator_color": "#FF0000",
        "settings": "{\"WD\":false,\"TIME_COL\":[255,0,0],\"TCOL\":[255,0,0],\"TMODE\":0,\"BRI\":1,\"ABRI\":false,\"ATRANS\":false}",
        "x": 280,
        "y": 260,
        "wires": [
            [
                "50dad4a6014e2bba"
            ]
        ]
    },
    {
        "id": "90d6c00fae07e101",
        "type": "inject",
        "z": "15d75fd54c8072af",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 100,
        "y": 260,
        "wires": [
            [
                "39961376d55bb433"
            ]
        ]
    },
    {
        "id": "763ae1564650cfce",
        "type": "awtrix3-notify",
        "z": "15d75fd54c8072af",
        "name": "",
        "icon": "https://developer.lametric.com/content/apps/icon_thumbs/19369",
        "text": "Hello World!",
        "options": "{\"rtttl\":\"two_short:d=4,o=5,b=100:16e6,16e6\",\"duration\":10}",
        "x": 300,
        "y": 320,
        "wires": [
            [
                "50dad4a6014e2bba"
            ]
        ]
    },
    {
        "id": "e4c03c99ac0ae4a9",
        "type": "awtrix3-app",
        "z": "15d75fd54c8072af",
        "name": "my-first-app",
        "application": "{\"icon\":\"https://developer.lametric.com/content/apps/icon_thumbs/30960\",\"text\":\"Hello, first AWTRIX 3 application!\",\"rainbow\":true,\"duration\":10}",
        "x": 290,
        "y": 440,
        "wires": [
            [
                "50dad4a6014e2bba"
            ]
        ]
    },
    {
        "id": "ab066211e6556d76",
        "type": "inject",
        "z": "15d75fd54c8072af",
        "name": "notify",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "{\"rainbow\":true,\"hold\":true}",
        "payloadType": "json",
        "x": 90,
        "y": 320,
        "wires": [
            [
                "763ae1564650cfce"
            ]
        ]
    },
    {
        "id": "33085daf0c51052b",
        "type": "awtrix3-notify",
        "z": "15d75fd54c8072af",
        "name": "",
        "icon": "",
        "text": "",
        "options": "{}",
        "x": 300,
        "y": 380,
        "wires": [
            [
                "50dad4a6014e2bba"
            ]
        ]
    },
    {
        "id": "5a38d7c3e1ce08a8",
        "type": "inject",
        "z": "15d75fd54c8072af",
        "name": "notify dismiss",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "0",
        "payloadType": "num",
        "x": 110,
        "y": 380,
        "wires": [
            [
                "33085daf0c51052b"
            ]
        ]
    },
    {
        "id": "59bf997073017444",
        "type": "inject",
        "z": "15d75fd54c8072af",
        "name": "create app",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "0",
        "payloadType": "num",
        "x": 100,
        "y": 440,
        "wires": [
            [
                "e4c03c99ac0ae4a9"
            ]
        ]
    },
    {
        "id": "5d051ce8f825f2aa",
        "type": "inject",
        "z": "15d75fd54c8072af",
        "name": "remove app",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "0",
        "payloadType": "num",
        "x": 110,
        "y": 500,
        "wires": [
            [
                "ebaf420b65c88549"
            ]
        ]
    },
    {
        "id": "ebaf420b65c88549",
        "type": "awtrix3-app",
        "z": "15d75fd54c8072af",
        "name": "my-first-app",
        "application": "{}",
        "x": 290,
        "y": 500,
        "wires": [
            [
                "50dad4a6014e2bba"
            ]
        ]
    },
    {
        "id": "d5dd6cf8d7bb38ee",
        "type": "inject",
        "z": "15d75fd54c8072af",
        "name": "reboot",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "reboot",
        "payload": "",
        "payloadType": "date",
        "x": 530,
        "y": 180,
        "wires": [
            [
                "50dad4a6014e2bba"
            ]
        ]
    },
    {
        "id": "dea74596033a091f",
        "type": "inject",
        "z": "15d75fd54c8072af",
        "name": "doupdate",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "doupdate",
        "payload": "{}",
        "payloadType": "json",
        "x": 540,
        "y": 240,
        "wires": [
            [
                "50dad4a6014e2bba"
            ]
        ]
    },
    {
        "id": "ed90e36223ed7600",
        "type": "awtrix3-config",
        "name": "awtrix_ce1dc4",
        "ipaddress": "192.168.88.170"
    }
]
```