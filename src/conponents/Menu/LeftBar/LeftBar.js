import styles from './LeftBar.module.css'
import firebase from 'firebase'
import useSound from 'use-sound';
import { FirebaseAuthConsumer } from '@react-firebase/auth'
import Navigatablechild from '../../../helper/Navigation'
import { Fab } from '@material-ui/core'
import GoogleIcon from './GoogleIcon.svg'
import { useStateManager } from '../../../helper/useStateManager';
import { Settings, 
    PowerSettingsNew,
    DevicesOther } from '@material-ui/icons'

import UserSound from '../../../sounds/Bing.wav'
import DeviceSound from '../../../sounds/Controller.wav'
import SettingsSound from '../../../sounds/Settings.wav'
import PowerSound from '../../../sounds/Turn Off.wav'

const LeftBar = () => {
    const { setDevice, volume, setSettings } = useStateManager();
    const [playUser] = useSound(UserSound, {volume});
    const [playDevice] = useSound(DeviceSound, { volume });
    const [playSettings] = useSound(SettingsSound, { volume });
    const [playPower] = useSound(PowerSound, { volume });

    return <div className={styles.main}>
        <div className={styles.buttonGroupTop}>
            <Navigatablechild x="0" y="0">
                <FirebaseAuthConsumer>
                    {({ isSignedIn, user }) => {
                        return (
                            <>
                                {isSignedIn ?  
                                    <Fab className={styles.profilePic} onClick={playUser} ><img alt="ProfileIMG" className={styles.fabimg} src={user.photoURL || process.env.PUBLIC_URL + '/blank-profile-picture.png'} /></Fab>
                                :
                                    <Fab className={styles.loginButton}
                                        onClick={() => {
                                            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                                            firebase.auth().signInWithPopup(googleAuthProvider);
                                        }}><img alt="GoogleIcon" src={GoogleIcon} />
                                    </Fab>
                                }
                            </>
                        );
                    }}
                </FirebaseAuthConsumer>
            </Navigatablechild>
        </div>
        <div className={styles.buttonGroup}>
            <Navigatablechild x="0" y="1"><Fab onClick={()=>{playDevice(); setDevice(true)}}><DevicesOther /></Fab></Navigatablechild>
            <Navigatablechild x="0" y="2"><Fab onClick={() => { playSettings(); setSettings(true)}}><Settings /></Fab></Navigatablechild>
            <Navigatablechild x="0" y="3"><Fab onClick={playPower}><PowerSettingsNew /></Fab></Navigatablechild>
        </div>
    </div>
}

export default LeftBar