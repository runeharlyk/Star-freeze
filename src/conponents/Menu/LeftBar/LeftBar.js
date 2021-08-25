import styles from './LeftBar.module.css'
import firebase from 'firebase'
import useSound from 'use-sound';
import { FirebaseAuthConsumer } from '@react-firebase/auth'
import Navigatablechild from '../../../helper/Navigation'
import { Fab } from '@material-ui/core'
import GoogleIcon from './GoogleIcon.svg'
import { Settings, 
    PowerSettingsNew,
    DevicesOther } from '@material-ui/icons'

import UserSound from '../../../sounds/Bing.wav'
import DeviceSound from '../../../sounds/Controller.wav'
import SettingsSound from '../../../sounds/Settings.wav'
import PowerSound from '../../../sounds/Turn Off.wav'

const LeftBar = () => {
    const [playUser] = useSound(UserSound);
    const [playDevice] = useSound(DeviceSound);
    const [playSettings] = useSound(SettingsSound);
    const [playPower] = useSound(PowerSound);

    return <div className={styles.main}>
        <div className={styles.buttonGroupTop}>
            <Navigatablechild x="0" y="0">
                <FirebaseAuthConsumer>
                    {({ isSignedIn, user, providerId }) => {
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
            <Navigatablechild x="0" y="1"><Fab onClick={playDevice}><DevicesOther /></Fab></Navigatablechild>
            <Navigatablechild x="0" y="2"><Fab onClick={playSettings}><Settings /></Fab></Navigatablechild>
            <Navigatablechild x="0" y="3"><Fab onClick={playPower}><PowerSettingsNew /></Fab></Navigatablechild>
        </div>
    </div>
}

export default LeftBar