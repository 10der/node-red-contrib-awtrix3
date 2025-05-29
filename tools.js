const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const sharp = require('sharp'); // For image processing (like Pillow/PIL)

const EventEmitter = require('events').EventEmitter;
const util = require('util');

function Awtrix3Device(host, creds) {
    this.host = host;
    this.creds = creds;
    if (!(this instanceof Awtrix3Device)) return new Awtrix3Device();
    EventEmitter.call(this);
    this.init();
}

Awtrix3Device.prototype.init = function () {
    this.initialize = false
    this.callApi('stats', null);
}

Awtrix3Device.prototype.callApi = function (endpoint, payload) {
    const ipaddress = this.host;
    const url = `http://${ipaddress}/api/${endpoint}`;
    const options = {
        timeout: 10000,
        method: payload ? 'POST' : 'GET',
        body: payload ? JSON.stringify(payload) : null,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    if (this.creds && this.creds.username && this.creds.username !== undefined) {
        const authHeader = Buffer.from(`${this.creds.username}:${this.creds.password}`).toString('base64');
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
            throw new Error(`Http error: ${response ? response.status : 'Network error'}`);
        })
        .then((data) => {
            if (!this.initialize) {
                this.emit("ready");
                this.initialize = true;
                return true;
            }
            this.initialize = true;
            this.emit("payload", endpoint, payload, data);

        })
        .catch((error) => {
            this.emit("error", error, endpoint, payload, null);
        });
}

Awtrix3Device.prototype.getIcon = async function (url) {
    try {
        const response = await fetch(url, { timeout: 10000 });
        if (response && response.ok) {
            const buffer = await response.arrayBuffer();
            const image = sharp(Buffer.from(buffer)).toFormat('jpeg');
            const jpegBuffer = await image.toBuffer();
            const base64Image = Buffer.from(jpegBuffer).toString('base64');
            return base64Image;
        } else {
            // node.warn(`Error fetching icon from ${url}: ${response ? response.status : 'Network error'}`);
            return null;
        }
    } catch (err) {
        // node.warn(`Exception while getting icon from ${url}:`, err);
        return null;
    }
}

util.inherits(Awtrix3Device, EventEmitter);

module.exports = Awtrix3Device;