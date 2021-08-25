import Nexus from "./Nexus";

var indexOf;

if (typeof Array.prototype.indexOf === 'function') {
    indexOf = function (haystack, needle) {
        return haystack.indexOf(needle);
    };
} else {
    indexOf = function (haystack, needle) {
        var i = 0, length = haystack.length, idx = -1, found = false;

        while (i < length && !found) {
            if (haystack[i] === needle) {
                idx = i;
                found = true;
            }

            i++;
        }

        return idx;
    };
};

var NexusPeer = function () {
    this.peerConnection = null;
    this.peerConnections = {};
    this.events = {};
    this.socket = {};
    this.RTCConfig = {
        'iceServers': [
            { 'urls': 'stun:stun.stunprotocol.org:3478' },
            { 'urls': 'stun:stun.l.google.com:19302' }
        ]
    };
    this.localIce = [];
}

NexusPeer.prototype.on = function(event, listener) {
    if (typeof this.events[event] !== 'object') {
        this.events[event] = [];
    }

    this.events[event].push(listener);
};
NexusPeer.prototype.removeListener = function(event, listener) {
    var idx;
    if (typeof this.events[event] === 'object') {
        idx = indexOf(this.events[event], listener);

        if (idx > -1) {
            this.events[event].splice(idx, 1);
        }
    }
};
NexusPeer.prototype.emit = function(event) {
    var i, listeners, length, args = [].slice.call(arguments, 1);

    if (typeof this.events[event] === 'object') {
        listeners = this.events[event].slice();
        length = listeners.length;

        for (i = 0; i < length; i++) {
            listeners[i].apply(this, args);
        }
    }
};
NexusPeer.prototype.once = function(event, listener) {
    this.on(event, function g() {
        this.removeListener(event, g);
        listener.apply(this, arguments);
    });
};
NexusPeer.prototype.errorHandler = (err) => {
    console.log(`%c[Error] %c${err}`, "color:red;", "color:white;");
}
NexusPeer.prototype.size = (object) => {
    var length = 0;
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            ++length;
        }
    }
    return length;
};
NexusPeer.prototype.debug = function(type, data = {}, decs = "") {
    this.emit("debug", { 'type': type, 'data': data, 'decs': decs })
}
NexusPeer.prototype.join = function(pin) {
    var _this = this;
    this.peerConnection = new RTCPeerConnection(this.RTCConfig);
    this.DataChannel = this.peerConnection.createDataChannel("dc");
    this.peerConnection.onicecandidate = (event) => {
        this.localIce.push(event.candidate);
    }
    this.DataChannel.onopen = () => { this.emit("connect") };
    this.DataChannel.onclose = () => { this.emit("close") };
    this.socket.onmessage = data => {
        if (!this.isJSON(data.data)) { console.log("Got string, not JSON"); return }
        var message = JSON.parse(data.data);
        switch (message.type) {
            case "answer":
                this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp))
                    .then(() => {
                        for (var i = 0; i < this.localIce.length; i++) {
                            this.socket.send(JSON.stringify({ 'ice': this.localIce[i] }));
                        }
                    }).catch(this.errorHandler);
                break;
            case "newice":
                if (typeof (this.peerConnection.addIceCandidate) === "function"){
                    this.peerConnection.addIceCandidate(new RTCIceCandidate(message.ice)).catch(this.errorHandler);
                }
                break;
            default:
                break;
        }
    }

    this.peerConnection.createOffer().then((description) => {
        this.peerConnection.setLocalDescription(description).then(() => {
            this.socket.send(JSON.stringify({ 'type': 'join', 'sdp': this.peerConnection.localDescription, 'pin': pin }));
            this.peerConnection.ondatachannel = (event) => {
                this.peerConnection = event.channel;
                this.peerConnection.onmessage = (rtcMess) => {
                    try { // Check is rtc message is of type json
                        var mess = JSON.parse(rtcMess.data)
                        this.emit("message", mess)
                    } catch (e) {
                        this.emit("messageString", rtcMess.data)
                    }
                };
                this.peerConnection.onclose = (e) => { _this.emit("close", "") };
                this.peerConnection.onconnectionstatechange = (event) => { this.debug("connectionChange", { 'connection': event.target }) }
            };
        }).catch(this.errorHandler);
    }).catch(this.errorHandler);
}
NexusPeer.prototype.host = function (SocketUrl){
    this.socket = new WebSocket(SocketUrl);
    this.socket.onopen = () => {
        this.socket.send(JSON.stringify({ 'type': 'get-uuid' }));
        this.socket.send(JSON.stringify({ "type": "create" }));
    }
    this.socket.onmessage = data => {
        if (!this.isJSON(data.data)) return
        var message = JSON.parse(data.data);
        if (message.type === "uuid") this.uuid = message.uuid;
        else if(message.type === "connect-pin")this.emit("room", message.pin);
        else if (message.type === "newice") this.peerConnections[message.remoteuuid].addIceCandidate(new RTCIceCandidate(message.ice)).catch(this.errorHandler);
        else if(message.type === "offer"){
            let remoteuuid = message.remoteuuid;
            this.peerConnections[remoteuuid] = new RTCPeerConnection(this.pcConfig);
            //this.pc[remoteuuid].emitter = new EventEmitter();
            //this.pc[remoteuuid].emitter.userid = remoteuuid;
            this.peerConnections[remoteuuid].userid = remoteuuid;
            this.peerConnections[remoteuuid].onicecandidate = (event) => {
                if (event.candidate != null) {
                    for (var i = 0; i < Object.keys(this.peerConnections).length; i++) {
                        this.socket.send(JSON.stringify({ 'ice': event.candidate, 'remoteuuid': Object.keys(this.peerConnections)[i] }));
                    }
                }
            }
            this.DataChannels = {};
            this.DataChannels[remoteuuid] = this.peerConnections[remoteuuid].createDataChannel("dc");
            //console.log(this.DataChannels[remoteuuid]);
            //this.DataChannels[remoteuuid].onopen = (event) => { this.emit("playerjoin", this.peerConnections[remoteuuid]) }
            //this.DataChannels[remoteuuid].onclose = (event) => { this.peerConnections[remoteuuid].emitter.emit("close", ""); delete this.peerConnections[remoteuuid]; delete this.DataChannels[remoteuuid] };
            this.peerConnections[remoteuuid].onconnectionstatechange = (event) => { this.debug("connectionChange", { 'connection': event.target }) }
            console.log(this.peerConnections[remoteuuid]);
            this.peerConnections[remoteuuid].ondatachannel = (event) => {
                this.emit("playerjoin", remoteuuid);
                event.channel.onmessage = (mess) => {
                    try { // Check is rtc message is of type json
                        message = JSON.parse(mess.data);
                        message.uuid = remoteuuid;
                        this.emit("message", message)
                    } catch (e) {
                        //scope.pc[remoteuuid].emitter.emit("data", `{"data":${mess.data},"json":false}`)
                    }
                };
            };
            this.peerConnections[remoteuuid].setRemoteDescription(new RTCSessionDescription(message.sdp)).then(() => {
                // Only create answers in response to offers
                this.peerConnections[remoteuuid].createAnswer().then((description) => {
                    this.peerConnections[remoteuuid].setLocalDescription(description).then(() => {
                        this.socket.send(JSON.stringify({ 'type': 'answer', 'sdp': this.peerConnections[remoteuuid].localDescription, 'remoteuuid': remoteuuid }));
                    }).catch(this.errorHandler);
                }).catch(this.errorHandler);
            }).catch(this.errorHandler);
        }
    }
}
NexusPeer.prototype.connect = function(SocketUrl) {
    this.socket = new WebSocket(SocketUrl);
    this.socket.onopen = () => {
        this.socket.send(JSON.stringify({ 'type': 'get-uuid' }));
    }
    this.socket.onmessage = data => {
        if (!this.isJSON(data.data)) return
        var message = JSON.parse(data.data);
        if(message.type === "uuid")this.uuid = message.uuid;
    }
}
NexusPeer.prototype.broadcast = function(message){
    if(!"DataChannels" in this || !this.DataChannels.readyState === "open"){
        this.send(message);
        return;
    };
    for (var i = 0; i < Object.keys(this.DataChannels).length; i++) {
        if (this.DataChannels[Object.keys(this.DataChannels)[i]].readyState !== 'open') return;
        this.DataChannels[Object.keys(this.DataChannels)[i]].send(message);
        
    }
} 
NexusPeer.prototype.send = function(message, remoteUUID = false){
    if (remoteUUID && "DataChannels" in this && this?.DataChannels[remoteUUID]?.readyState === "open") {
        this.DataChannels[remoteUUID].send(JSON.stringify(message))
        return
    }
    if (!"DataChannel" in this || this?.DataChannel?.readyState !== "open")return;
    this.DataChannel.send(JSON.stringify( message ));
}
NexusPeer.prototype.numberOfConnections = function(){
    return Object.keys(this.DataChannels).length;
}
NexusPeer.prototype.isJSON = (str) => {
    try { JSON.parse(str) }
    catch (e) { return false }
    return true;
}
export default NexusPeer