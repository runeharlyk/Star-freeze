import styles from './ScreenShotControl.module.css'
import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from "react-spring";
import ScreenShot from '../../helper/ScreenShot';
import { useStateManager } from '../../helper/useStateManager';
import useSound from 'use-sound';
import klickSound from '../../sounds/Klick.wav'

const ScreenShotControl = () => {
    const {volume} = useStateManager();
    const [screenshotsoundplay] = useSound(klickSound, { volume });
    const [image, setImage] = useState(false);
    const [open, setOpen] = useState(false);
    const [timeOutState, setTimeoutState] = useState();
    const input = useRef();
    const props = useSpring({
        opacity: open ? "2" : "0",
        zIndex: open ? "1" : "-1"
    });

    useEffect(() => {
        setOpen(true);
        clearTimeout(timeOutState);
        setTimeoutState(setTimeout(() => {
            setOpen(false);
        }, 3000));
    }, [image])

    useEffect(() => {
        ScreenShot.on("captured", imgdata => {
            setImage(imgdata);
            screenshotsoundplay();
        })
    },[])
    return image?<animated.div className={styles.main} style={props}>
       <img src={image} className={styles.screenshot}/><div>Capture taken</div>
    </animated.div>:null
}

export default ScreenShotControl