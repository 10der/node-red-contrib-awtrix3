const fetch = require('node-fetch');
const sharp = require('sharp'); // For image processing (like Pillow/PIL)

module.exports.getIcon = async function (url) {
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

module.exports.callApi = function (ipaddress, endpoint, creds, func, err, payload) {
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
            throw new Error(`Http error: ${response ? response.status : 'Network error'}`);
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
