import styles from './VolumeControl.module.css'
import { useState, useEffect, useRef } from 'react';
import {VolumeUp, VolumeDown, VolumeOff} from '@material-ui/icons';
import { useSpring, animated } from "react-spring";
import Nexus from '../../helper/Nexus';
import { useStateManager } from '../../helper/useStateManager';

const VolumeControl = () => {
    const [localVolume, setLocalVolume] = useState(10);
    const [open, setOpen] = useState(false);
    const [timeOutState, setTimeoutState] = useState();
    const {setVolume} = useStateManager();
    const input = useRef();
    const props = useSpring({
        right: open ? "40px" : "-100px"
    });

    useEffect(() => {
        setOpen(true);
        clearTimeout(timeOutState);
        setTimeoutState(setTimeout(() => {
            setOpen(false);
        }, 3000));
        input.current.value = localVolume;
    },[localVolume]) 

    useEffect(() => {
        Nexus.on("message", data => {
            if(data.type !== "volume")return
            setLocalVolume(data.volume);
        })
    },[])

    const handleVolumeChange = (e) => {
        setLocalVolume(e.target.value);
        setVolume(Math.round(e.target.value/15*100)/100);
        console.log(Math.round(e.target.value / 15 * 100) / 100)
    }
    return <animated.div className={styles.main} style={props}>
       
        {localVolume == 0 ? <VolumeOff />:localVolume <=10?<VolumeDown />:<VolumeUp />}
        <input className={styles.volumeRange} ref={input} onChange={handleVolumeChange} defaultValue="10" type="range" min="0" max="15" />
        {localVolume}
    </animated.div>
}

export default VolumeControl