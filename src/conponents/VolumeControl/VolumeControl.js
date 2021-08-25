import styles from './VolumeControl.module.css'
import { useState, useEffect, useRef } from 'react';
import {VolumeUp, VolumeDown, VolumeOff} from '@material-ui/icons';
import { useSpring, animated } from "react-spring";
import Nexus from '../../helper/Nexus';

const VolumeControl = () => {
    const [volume, setVolume] = useState(10);
    const [open, setOpen] = useState(false);
    const [timeOutState, setTimeoutState] = useState();
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
        input.current.value = volume;
    },[volume]) 

    useEffect(() => {
        Nexus.on("message", data => {
            if(data.type !== "volume")return
            setVolume(data.volume);
        })
    },[])

    const handleVolumeChange = (e) => {
        setVolume(e.target.value)
    }
    return <animated.div className={styles.main} style={props}>
       
        {volume == 0 ? <VolumeOff />:volume <=10?<VolumeDown />:<VolumeUp />}
        <input className={styles.volumeRange} ref={input} onChange={handleVolumeChange} defaultValue="10" type="range" min="0" max="15" />
        {volume}
    </animated.div>
}

export default VolumeControl