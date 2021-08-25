import styles from './App.module.css';
import { useEffect, useState } from 'react';
import firebase from './auth/initFirebase'
import Menu from './conponents/Menu/Menu'
import VolumeControl from './conponents/VolumeControl/VolumeControl';
import Nexus from './helper/Nexus';
import ScreenShot from './helper/ScreenShot';
import ScreenShotControl from './conponents/ScreenShotControl/ScreenShotControl';
import Gallery from './conponents/Gallery/Gallery';
import useSound from 'use-sound';
import getBrowserFingerprint from 'get-browser-fingerprint';
import { browserName, browserVersion, osName, osVersion } from "react-device-detect";

import Flight from './Games/Flight';
import HomeSound from './sounds/Home.wav'
import ScreenShotSound from './sounds/Klick.wav'

/*

const fingerprint = getBrowserFingerprint();

vibrate = navigator.vibrate || navigator.mozVibrate

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
}

*/

console.log(getBrowserFingerprint());

const db = firebase.database();

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playHomeSound] = useSound(HomeSound)
  const [playKlickSound] = useSound(ScreenShotSound)
  const [galleryOpen, setGalleryOpen] = useState(false);
  useEffect(() => {
    Nexus.host("wss://developer.runeharlyk.dk:2096/");
    Nexus.on("message", data => {
      if (data.type !== "ping" && data.type !== "deviceMotion") console.log(data);
      switch (data.type) {
        case "hello":
          Nexus.send({
            "type": "hello",
            "color": Nexus.size(Nexus.peerConnections),
            "controller": 1
          }, data.uuid);
          break;
        case "ping":
          Nexus.send({"type":"pong"},data.uuid)
          break;
        case "joystick":
          //handleJoystick(data.joystick, data.uuid)
          //setControllerLayout(data.id)
          break;
        case "bpress":
          if (data.button === "picture") ScreenShot.capture();
          else if (data.button === "home") playHomeSound();
          break;
        default:
          break;
      }
    })

    Nexus.on("room", (pin) => {
      console.log(pin);
      setTimeout(() => {
        if (firebase.auth().currentUser){
          const userref = db.ref(`users/${firebase.auth().currentUser.uid}`);
          const fingerprint = getBrowserFingerprint();
          const system = `${osName} ${osVersion}`;
          const browser = `${browserName} ${browserVersion}`
          userref.child('info').set({
            last_id: pin,
            date: new Date().getTime(),
            nickname:null,
          });
          db.ref(`users/${firebase.auth().currentUser.uid}/info/devices/${fingerprint}`).set({
            fingerprint,
            type: 'host',
            browser,
            system
          })
        }
      }, 1000)
    });
  }, [])
  return (
    <div className={styles.body}>
      <Flight />
      <ScreenShotControl />
      <VolumeControl />
      
      {settingsOpen??"Settings open"}
    </div>
  );
}
// 
//{galleryOpen ? <Gallery /> : <Menu />}
//<ScreenShotControl />

export default App;
