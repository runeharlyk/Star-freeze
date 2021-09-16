import styles from './App.module.css';
import { useEffect, useState } from 'react';
import firebase from './auth/initFirebase'
import Menu from './conponents/Menu/Menu'
import Devices from './conponents/Devices/Devices';
import VolumeControl from './conponents/VolumeControl/VolumeControl';
import Nexus from './helper/Nexus';
import ScreenShot from './helper/ScreenShot';
import ScreenShotControl from './conponents/ScreenShotControl/ScreenShotControl';
import Gallery from './conponents/Gallery/Gallery';
import useSound from 'use-sound';
import getBrowserFingerprint from 'get-browser-fingerprint';
import { browserName, browserVersion, osName, osVersion } from "react-device-detect";
import { sha256 } from 'js-sha256';
import { useStateManager, setPin } from './helper/useStateManager';

import Flight from './Games/Flight';
import HomeSound from './sounds/Home.wav'
import Settings from './conponents/Settings/Settings';

/*

const fingerprint = getBrowserFingerprint();

vibrate = navigator.vibrate || navigator.mozVibrate

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
}

*/

const db = firebase.database();

function App() {
  const { settings, device, gallery, game, volume } = useStateManager();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playHomeSound] = useSound(HomeSound, { volume })
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(true);
  useEffect(() => {
    Nexus.host("wss://developer.runeharlyk.dk:2096/");

    Nexus.on("message", data => {
      if (data.type !== "ping" && data.type !== "deviceMotion") console.log(data);
      switch (data.type) {
        case "hello":
          Nexus.send({
            "type": "hello",
            "color": Nexus.size(Nexus.peerConnections),
            "controller": 0
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
          if (data.button === "picture") ScreenShot.capture()
          else if (data.button === "home") playHomeSound();
          break;
        default:
          break;
      }
    })

    Nexus.on("room", (pin) => {
      setPin(pin);
      setTimeout(() => {
        if (firebase.auth().currentUser){
          const fingerprint = getBrowserFingerprint();
          const system = `${osName} ${osVersion}`;
          const browser = `${browserName} ${browserVersion}`;
          const userref = db.ref(`users/${firebase.auth().currentUser.uid}`);
          const deviceid = sha256(firebase.auth().currentUser.uid + 'host' + osName+osVersion+browser);

          userref.child('public').update({
            date: new Date().getTime(),
            display_photo: firebase.auth().currentUser.photoURL || '',
            display_name: firebase.auth().currentUser.displayName || '',
          });

          userref.child('private').update({
            last_id: pin,
            settings:{}
          })

          userref.child('private').child('devices').update({ [deviceid]: new Date().getTime()});

          db.ref(`devices/${deviceid}`).update({
            fingerprint,
            type: 'host',
            browser,
            user: firebase.auth().currentUser.uid,
            system,
            last_date: new Date().getTime()
          })
        }
      }, 1000)
    });
  }, [])

  useEffect(() => {
    if (game === 0) Nexus.broadcast({"type":"controller", "id":1})
  },[game])

  return (
    <div className={styles.body}>
      <Menu device={setDevicesOpen} />
      {device?<Devices close={setDevicesOpen} />:null}
      {gallery?<Gallery />:null}
      <ScreenShotControl />
      <VolumeControl />
      {game===""?null:
       game===0?<Flight />:null 
      }
      
      {settings?<Settings/>:null}
    </div>
  );
}
//<Flight />
//{devicesOpen?<Devices />:null}
//{galleryOpen ? <Gallery /> : <Menu />}
//<ScreenShotControl />

export default App;
