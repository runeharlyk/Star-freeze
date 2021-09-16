import styles from './Devices.module.css'
import { useState, useEffect, useMemo } from 'react'
import { Fab, Badge, Button } from '@material-ui/core'
import { Shop, PhotoLibrary, Chat, Wifi, Battery80, SubscriptionsOutlined } from '@material-ui/icons'
import Navigatablechild from '../../helper/Navigation'
import ScreenShot from '../../helper/ScreenShot'
import firebase from '../../auth/initFirebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import getBrowserFingerprint from 'get-browser-fingerprint';
import { useStateManager } from '../../helper/useStateManager'
import { useSpring, animated } from "react-spring";
import Nexus from '../../helper/Nexus'
import Controller from '../Controller/Controller'
import useSound from 'use-sound'
import QRCode from "react-qr-code";
import clicksound from '../../sounds/Enter & Back.wav'
import { PhoneIphone, VideogameAsset ,PhoneAndroid, DesktopMac, DevicesOther } from '@material-ui/icons'
import Modal from '../Modal/Modal'
const db = firebase.database();

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

const Devices = () => {
    const [devices, setDevices] = useState([]);
    const [openPairMenu, setOpenPairMenu] = useState(false);
    const [localDevices, setLocalDevices] = useState([]);
    const { setDevice, pin, volume } = useStateManager();
    const [click] = useSound(clicksound, { volume });
    const [user] = useAuthState(firebase.auth());
    const [fade, setFade] = useState(false);
    const fingerprint = getBrowserFingerprint();
    const props = useSpring({
        opacity: fade ? "1" : "0",
        top: fade? 0: 10
    });

    const shareGamepin = (ip) => {
        Nexus.gateway.send(JSON.stringify({ 'type': 'pin',pin,ip }));
    }

    useEffect(() => {
        if(user){
            const userref = db.ref(`users/${firebase.auth().currentUser.uid}/private/devices`);
            userref.on('value', (snapshot) => { 
                const all = [];
                for (const [key, value] of Object.entries(snapshot.val() || {})) {
                    all.push(key);
                }
                db.ref("devices").once("value", function (snapshot) {
                    setDevices([])
                    Object.keys(snapshot.val()).map(k => {
                        if (all.indexOf(k) !== -1) {
                            const device = snapshot.val()[k];
                            db.ref(`users/${device.user}/public`).once('value', (shot) => {
                                const unitInfo = {
                                    ...shot.val(),
                                    ...device
                                }
                                setDevices(prevState => ([...prevState, unitInfo]))
                            })
                           
                        }
                    })
                })
                
            }, (errorObject) => {
                console.log('The read failed: ' + errorObject.name);
            });
        }
    }, [user])

    useEffect(() => {
        setFade(true)
        Nexus.gateway.send(JSON.stringify({'type':'get-peers'}));
        Nexus.on("gateway", message => {
            if(message.type === 'peers'){
                console.log(message.peers);
                setLocalDevices(message.peers);
            } else if (message.type === "peer-left" || message.type === "peer-joined") Nexus.gateway.send(JSON.stringify({ 'type': 'get-peers' }));

        })
    },[])
    return <Modal title={<><DevicesOther />   Devices</>}>
            <div className={styles.bigcolum}>
                    <div className={styles.row}>
                        <h2>Host</h2>
                        <div className={styles.deviceContainer}>
                            <DesktopMac />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <h2 className={styles.headline}>Controllers</h2>
                        <div className={styles.deviceContainer}>
                    <Controller />
                        {devices.map((device, i) => (<>
                            {device.type !== "host" ? (
                            <div className={styles.device} key={i} title={timeConverter(device.last_date / 1000)}>
                                    <Badge color={(new Date().getTime()-device.last_date)/1000 < 360?"primary":"secondary"} variant="dot"><VideogameAsset /></Badge>
                                <div>{device.display_name} {device.system}</div>
                            </div>
                            ):null}
                            
                        </>))}

                    {localDevices.map((localdevice, i) => (<>
                        <div className={styles.device} onClick={() => shareGamepin(localdevice.id)} key={localdevice.id} title={localdevice.name.displayName}>
                            <Badge color={"primary"} variant="dot"><VideogameAsset /></Badge>
                            <div>{localdevice.name.displayName} {localdevice.name.os}</div>
                        </div>

                    </>))}

                        </div>
                        </div>                
                </div>
                <div className={styles.smallcolum}>{
                   !openPairMenu?(<>
                        <Navigatablechild x="0" y="0" className={styles.but} onClick={() => { click(); setOpenPairMenu(true) }}><Button style={{ color: "white" }} >Pair new controller</Button></Navigatablechild>
                        <Navigatablechild x="0" y="1" className={styles.but}><Button style={{ color: "white" }} onClick={()=> {click()}}>Calibrate controllers</Button></Navigatablechild>
                        <Navigatablechild x="0" y="2" className={styles.but} onClick={() => { click(); setDevice(false) }}><Button style={{ color: "white" }}>Close</Button></Navigatablechild>
                    </>
                   ):(
                        <>
                            <QRCode className={styles.qrcode} value={`https://play.runeharlyk.dk/player?p=${pin}`} />
                            <div>Scan QR or go to <code>play.runeharlyk.dk</code> and use <code>{pin}</code> to pair device</div>
                            <Navigatablechild x="0" y="0" className={styles.but}><Button style={{ color: "white" }} onClick={() => { click(); setOpenPairMenu(false) }}>Back</Button></Navigatablechild>
                        </>
                   )
                }
                    
                </div>
        </Modal>
        
}

export default Devices