import html2canvas from "html2canvas";
import firebase from "firebase";

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

var ScreenShotHelper = function () {
    this.isSatUp = false;
    this.events = {};
    this.keepStreamAlive = true;
    this.streamActive = false;
    this.type = "native";
    this.shouldDownload = false;
    this.shouldSafeToCloud = false;
    this.shouldSafeToLocally = true;

    this.canvas = document.createElement('canvas');
    this.video = document.createElement("video");
    this.emit("captured","img");
}

ScreenShotHelper.prototype.on = function (event, listener) {
    if (typeof this.events[event] !== 'object') {
        this.events[event] = [];
    }

    this.events[event].push(listener);
};
ScreenShotHelper.prototype.removeListener = function (event, listener) {
    var idx;
    if (typeof this.events[event] === 'object') {
        idx = indexOf(this.events[event], listener);

        if (idx > -1) {
            this.events[event].splice(idx, 1);
        }
    }
};
ScreenShotHelper.prototype.emit = function (event) {
    var i, listeners, length, args = [].slice.call(arguments, 1);

    if (typeof this.events[event] === 'object') {
        listeners = this.events[event].slice();
        length = listeners.length;

        for (i = 0; i < length; i++) {
            listeners[i].apply(this, args);
        }
    }
};
ScreenShotHelper.prototype.once = function (event, listener) {
    this.on(event, function g() {
        this.removeListener(event, g);
        listener.apply(this, arguments);
    });
};

ScreenShotHelper.prototype.capture = function() {
    switch(this.type){
        case "html2canvas":
            html2canvas(document.querySelector("#root")).then(canvas => {
                document.body.appendChild(canvas);
                this.download(canvas);
            });
            break;
        default:
            try {
                if(!this.isSatUp){
                    document.body.append(this.video);
                    this.video.autoplay = true;
                    navigator.mediaDevices.getDisplayMedia()
                        .then(stream => {
                            this.video.srcObject = stream;
                            this.video.addEventListener('play', () => {
                                this.canvas.width = this.video.videoWidth;
                                this.canvas.height =this. video.videoHeight;
                                this.canvas.getContext('2d').drawImage(this.video, 0, 0);
                                this.emit("captured", this.canvas.toDataURL());
                                if (this.shouldDownload) this.download(this.canvas);
                                if (this.shouldSafeToCloud) this.safeToCloud(this.canvas);
                                if (this.shouldSafeToLocally) this.safeLocally(this.canvas)
                            });
                        })
                        this.isSatUp = true;
                        return
                }else{
                    this.canvas.getContext('2d').drawImage(this.video, 0, 0);
                    this.emit("captured", this.canvas.toDataURL());
                    if (this.shouldDownload) this.download(this.canvas);
                    if (this.shouldSafeToCloud) this.safeToCloud(this.canvas);
                    if (this.shouldSafeToLocally) this.safeLocally(this.canvas)
                }
                
            } catch (err) {
                console.error("Error: " + err);
            }
            break;
    }
}

ScreenShotHelper.prototype.download = function(canvas) {
    const link = document.createElement('a');
    link.download = 'Starfreeze - Screenshot.png';
    link.href = canvas.toDataURL();
    link.click();
    document.body.append(link);
    link.remove();
    return;
}

ScreenShotHelper.prototype.safeToCloud = function(canvas){
    let dataURL = canvas.toDataURL();/*
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var uploadTask = storageRef.child('folder/' + file.name).put(file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
            var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100
            this.setState({ progress })
        }, (error) => {
            throw error
        }, () => {
            // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{

            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                this.setState({
                    downloadURL: url
                })
            })
            document.getElementById("file").value = null

        }
    )*/
}
ScreenShotHelper.prototype.retrieveLocal = function(){
    var Images = [];
    var keys = Object.keys(localStorage),
        i = keys.length,
        filename = 'screenshot-1.png';
    if (keys.length > 0) {
        while (i--) {
            let NUMERIC_REGEXP = /[screenshot-]\d{1,}[.]/g;
            var result = keys[i].match(NUMERIC_REGEXP);
            if (result) {
                var image = { 'name': keys[i], 'src': localStorage.getItem(keys[i])}
                Images.push(image);
            }
        }
    }
    return Images;
}

ScreenShotHelper.prototype.safeLocally = function(canvas){
    var keys = Object.keys(localStorage),
        i = keys.length,
        filename = 'screenshot-1.png';
    if(keys.length > 0){
        while (i--) {
            let NUMERIC_REGEXP = /[screenshot-]\d{1,}[.]/g;
            var result = keys[i].match(NUMERIC_REGEXP);
            if (result) {
                var highestNum = parseInt(result[0].replace("-", ""));
                filename = `screenshot-${highestNum + 1}.png`
                break;
            }
        }
    }
    
    let dataURL = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
    localStorage.setItem(filename, dataURL)
}

ScreenShotHelper.prototype.use = function (type) {
    if(type === "html2canvas") this.type = type;
    else this.type = "native";

}

const ScreenShot = new ScreenShotHelper();

export default ScreenShot;