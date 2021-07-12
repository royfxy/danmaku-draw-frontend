let baseURL
let token

export function setBaseURL(base) {
    base = base.replace(/^\/ | \/$/g, '')
    base = base.replace(/^https?:\/\//i, '')
    baseURL = base
}

export function setToken(authToken) {
    token = authToken
}

export function connectWebsocket(url, protocol = "wss") {
    let fullURL = protocol + "://" + baseURL + url
    const socket = new WebSocket(fullURL);

    socket.onclose = function() {
        setTimeout(() => {
            connectWebsocket(url)
        }, 1000)
    }

    socket.addEventListener('message', function(event) {
        msgHandler.exec(JSON.parse(event.data));
    });
}

export async function requestOperation(url, protocol = "https") {
    let fullURL = protocol + "://" + baseURL + url
    try {
        let headers = token === null ? {} : { 'XAuth-Token': token }
        let response = await fetch(fullURL, {
            headers: headers,
        })
        let message = await response.json()

        if (message !== null) {
            msgHandler.exec(message);
        }
    } catch (error) {
        console.log(error);
    }
}

export let msgHandler = {
    register: function(type, func) {
        if (Array.isArray(type)) {
            for (var index in type) {
                if (!(type[index] in this._funcs)) {
                    this._funcs[type[index]] = []
                }
                this._funcs[type[index]].push(func)
            }
        } else {
            if (!(type in this._funcs)) {
                this._funcs[type] = []
            }
            this._funcs[type].push(func)
        }

    },
    exec: function(message) {
        let messageType = message["type"]
        let data = message["data"]
        if (messageType in this._funcs) {
            for (var index in this._funcs[messageType]) {
                this._funcs[messageType][index](data, messageType)
            }

        } else {
            console.log(`undefined message type: ${messageType}.`);
        }
    },
    _funcs: {}
}