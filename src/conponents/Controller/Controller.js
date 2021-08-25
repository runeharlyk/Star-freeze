import styles from './Controller.module.css';
import { useState, useEffect } from 'react';
import Nexus from '../../helper/Nexus';

const portraitOrientations = ["portrait", "portrait-primary", "portrait-secondary"]

const controllerHTML = (Controller) => {
    return <div className={`${styles.playerOverview} ${Controller.rotated ? styles.rotate : ""} ${Controller.connected ? "" : styles.disconnected}`}>
        <div className={styles.dots}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
        </div>
        <div style={Controller.color ? { backgroundColor: Controller.color } : {}} className={styles.players}></div>
        <div className={styles.battery}></div>
    </div>
}

export default function Controller() {
    const [controller1, setController1] = useState({ rotated: true, connected: false});
    const [controller2, setController2] = useState({ rotated: true, connected: false});
    const [controller3, setController3] = useState({ rotated: true, connected: false});
    const [controller4, setController4] = useState({ rotated: true, connected: false });
    useEffect(()=>{
        Nexus.on("message", message => {
            if (message.type === "color") {
                const color = message.color;
                setController1(prev => ({...prev, color}));
            } else if (message.type === "orientation"){
                const rotated = portraitOrientations.includes(message.current);
                setController1(prev => ({...prev, rotated}))
            }
        })

        Nexus.on("playerjoin", player => {
            const numPlayers = Nexus.numberOfConnections();
            if (numPlayers === 1) setController1(prev => ({...prev, connected:true, uuid:player}))
            else if (numPlayers === 2) setController2(prev => ({ ...prev, connected: true, uuid: player }))
            else if (numPlayers === 3) setController3(prev => ({ ...prev, connected: true, uuid: player }))
            else setController4(prev => ({ ...prev, connected: true, uuid: player }))

        })

        Nexus.on("playerleave", player => {
            console.log(player);
        })

    },[])

    return (
        <div className={styles.playerOverviewContainer}>
            {controllerHTML(controller1)}
            {controllerHTML(controller2)}
            {controllerHTML(controller3)}
            {controllerHTML(controller4)}
        </div>
    );
}