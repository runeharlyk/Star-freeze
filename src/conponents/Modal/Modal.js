import styles from './Modal.module.css'
import { useState, useEffect, useMemo } from 'react'
import { Fab, Badge, Button } from '@material-ui/core'
import { useSpring, animated } from "react-spring";

const Modal = (props) => {
    const [fade, setFade] = useState(false);
    const styleprops = useSpring({
        opacity: fade ? "1" : "0",
        top: fade ? 0 : 10
    });

    useEffect(() => {
        setFade(true)
    }, [])
    return <animated.div className={styles.main} style={styleprops}>
        <div className={styles.body} >
            <div className={styles.header}><div className={styles.border}>{props.title}</div> <div>{props.righttitle} </div></div>
            <div className={styles.container}>
                {props.children}
            </div>
        </div>
    </animated.div>
}

export default Modal