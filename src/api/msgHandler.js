export let baseURL

export function setBaseURL(base) {
    base = base.replace(/^/ | /$/g, '')
    base = base.replace(/^https?:\/\//i, '')
    baseURL = base
}

export function connectWebsocket(url, protocol = "wss") {
    let fullURL = protocol + "://" + baseURL + url
    const canvasSocket = new WebSocket(fullURL);

    canvasSocket.addEventListener('message', function(event) {
        msgHandler.exec(JSON.parse(event.data));
    });
}

export async function getOperation(url, authToken = null, protocol = "https") {
    let fullURL = protocol + "://" + baseURL + url
    console.log(fullURL)
    try {
        let headers = authToken === null ? {} : { 'XAuth-Token': authToken }
        let response = await fetch(fullURL, {
            headers: headers,
            mode: 'no-cors',
        })
        let message = await response.json();
        if (message !== null) {
            msgHandler.exec(message);
        }
    } catch (error) {
        console.log(error);
    }
}


export let msgHandler = {
    register: function(type, func) {
        this._funcs[type] = func
    },
    exec: function(message) {
        let messageType = message["type"]
        let data = message["data"]
        if (messageType in this._funcs) {
            this._funcs[messageType](data)
        } else {
            console.log(`undefined message type: ${messageType}.`);
        }
    },
    _funcs: {}
}