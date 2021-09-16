import { useState } from "react"
import Modal from "../Modal/Modal"
import styles from './Settings.module.css'
import { Button } from "@material-ui/core"
import Navigatablechild from "../../helper/Navigation"
import { Settings as SettingsIcon} from "@material-ui/icons"
import getBrowserFingerprint from 'get-browser-fingerprint';
import { browserName, browserVersion, osName, osVersion } from "react-device-detect";
import { useAuthState } from "react-firebase-hooks/auth"
import firebase from '../../auth/initFirebase'
import clicksound from '../../sounds/Enter & Back.wav'
import useSound from "use-sound"
import { useStateManager } from "../../helper/useStateManager"

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
    return time;
}

const SettingsContainer = (props) => {
    return <div className={styles.settingsContainer}>
        <h2 className={styles.title}>{props.title}</h2>
        <div className={styles.settingsContent}>{props.children}</div>
    </div>
}

const Row = (props) => {
    return <Navigatablechild y={props.y} x="1" className={styles.row}><div>{props.title}</div><div>{props.children}</div></Navigatablechild>
}

/* <SettingsContainer title={"Display"}></SettingsContainer>
                <SettingsContainer title={"Sound"}></SettingsContainer>
                <SettingsContainer title={"Controller"}></SettingsContainer>
                <SettingsContainer title={"Network"}></SettingsContainer>
                <SettingsContainer title={"Accessibility"}></SettingsContainer>
                <SettingsContainer title={"System"}></SettingsContainer>
                <SettingsContainer title={"Documents & about"}></SettingsContainer> */
const Settings = () => {
    const [user] = useAuthState(firebase.auth());
    const { setSettings, pin, volume } = useStateManager();
    const [click] = useSound(clicksound, { volume });
    const [activeContainer, setActiveContainer] = useState(0)
    const buttonStyle = { color: "white", width: "100%", display: "inline", textAlign:"left"};

    return <Modal title={<><SettingsIcon /> Settings</>}>
        <>
            <div className={styles.smallcolumn}>
                <Navigatablechild className={styles.button} x="0" y="0"><Button onClick={() => { setActiveContainer(0) }} style={buttonStyle}>User</Button></Navigatablechild>
                <Navigatablechild className={styles.button} x="0" y="1"><Button onClick={() => { setActiveContainer(1) }} style={buttonStyle}>Display</Button></Navigatablechild>
                <Navigatablechild className={styles.button} x="0" y="2"><Button onClick={() => { setActiveContainer(2) }} style={buttonStyle}>Sound</Button></Navigatablechild>
                <Navigatablechild className={styles.button} x="0" y="3"><Button onClick={() => { setActiveContainer(3) }} style={buttonStyle}>Controllers</Button></Navigatablechild>
                <Navigatablechild className={styles.button} x="0" y="4"><Button onClick={() => { setActiveContainer(4) }} style={buttonStyle}>Network</Button></Navigatablechild>
                <Navigatablechild className={styles.button} x="0" y="5"><Button onClick={() => { setActiveContainer(5) }} style={buttonStyle}>Accessibility</Button></Navigatablechild>
                <Navigatablechild className={styles.button} x="0" y="6"><Button onClick={() => { setActiveContainer(6) }} style={buttonStyle}>System</Button></Navigatablechild>
                <Navigatablechild className={styles.button} x="0" y="7"><Button onClick={() => { setActiveContainer(7) }} style={buttonStyle}>Documents &amp; about</Button></Navigatablechild>
                <Navigatablechild className={styles.button} x="0" y="8"><Button onClick={() => { click(); setSettings(false) }} style={buttonStyle}>Close</Button></Navigatablechild>
            </div>
            <div className={styles.bigcolumn}>
                {activeContainer === 0?
                (
                    <SettingsContainer title={"User"}>
                        <Row y="0" title={"Diplay name"}>{user?.displayName||''}</Row>
                        <Row y="1" title={"Nickname"}>{user?.displayName||''}</Row>
                        <Row y="2" title={"Console pin"}>{pin}</Row>
                        <Row y="3" title={"Played"}>6 Hours</Row>
                    </SettingsContainer>):activeContainer === 1?
                    (<SettingsContainer title={"Display"}></SettingsContainer>) : activeContainer === 2 ?
                    (<SettingsContainer title={"Sound"}></SettingsContainer>) : activeContainer === 3 ?
                    (<SettingsContainer title={"Controller"}></SettingsContainer>) : activeContainer === 4 ?
                    (<SettingsContainer title={"Network"}></SettingsContainer>) : activeContainer === 5 ?
                    (<SettingsContainer title={"Accessibility"}></SettingsContainer>) : activeContainer === 6 ?
                    (<SettingsContainer title={"System"}>
                        <Row y="0" title={"Language"}>DK/EN</Row>
                        <Row y="1" title={"Region"}>Denmark</Row>
                        <Row y="2" title={"Date and time"}>{timeConverter(new Date().getTime())}</Row>
                        <div className={styles.line} />
                        <Row y="3" title={"Operation system"}>{`${osName} ${osVersion}`}</Row>
                        <Row y="4" title={"Browser"}>{`${browserName} ${browserVersion}`}</Row>
                        <Row y="5" title={"Software version"}>{`beta 1.1.2`}</Row>
                    </SettingsContainer>
                    ) : activeContainer === 7 ? (<SettingsContainer title={"Documents & about"}></SettingsContainer>):null}
                

                <div>
                    <h2>Display</h2>
                    <div>Display name</div>
                    <div>Device</div>
                    <div>Log out</div>
                </div>
                <div>
                    <h2>Device</h2>
                    <div>Browser fingerprint</div>
                    <div>Multiple displays</div>
                    <div>System</div>
                </div>
                <div>
                    <h2>Sound</h2>
                    <div>Volume</div>
                    <div>SFX</div>
                    <div>Effects</div>
                </div>
                <div>
                    <h2>Interaction</h2>
                    <div>Discover local</div>
                    <div>Fullscreen</div>
                    <div>Auto Connect</div>
                    <div>Remember controllers</div>
                    <div>Screen lock</div>
                    <div>Burnin guard</div>
                </div>
                <div>
                <h2>Network || Internet</h2>
                    <div>Ping</div>
                    <div>Network speed</div>
                    <div>Date &amp; time</div>
                </div>
                <div>
                    <h2>System &amp; Accessibility</h2>
                    <div>configure settings such as console nickname, language, region, date &amp; time, change display colors, enable Zoom.</div>
                    <div>Language</div>
                    <div>Theme</div>
                    <div>Scale</div>
                    <div>Notifications</div>
                </div>
                <div>
                    <h2>Documents &amp; about</h2>
                    <div>Terms and service</div>
                    <div>Privacy</div>
                </div>
                <Navigatablechild x="1" y="0"><Button style={{ color: "white" }}>Close</Button></Navigatablechild>
            </div>
        </>
    </Modal>
}

export default Settings