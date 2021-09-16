import styles from './Header.module.css'
import { useState, useEffect } from 'react'
import { Fab, Badge } from '@material-ui/core'
import { Shop, PhotoLibrary, Chat, Wifi, Battery80 } from '@material-ui/icons'
import Navigatablechild from '../../../helper/Navigation'
import { useStateManager } from '../../../helper/useStateManager'
import useSound from 'use-sound';

import GallerySound from '../../../sounds/Album.wav'
import EshopSound from '../../../sounds/Eshop.wav'
import ChatSound from '../../../sounds/News.wav'

const Header = () => {
    const [loop, setLoop] = useState({});
    const [time, setTime] = useState("00:00");
    const {setGallery, volume} = useStateManager()
    
    const [albumPlay] = useSound(GallerySound, { volume });
    const [eshopPlay] = useSound(EshopSound, { volume });
    const [chatPlay] = useSound(ChatSound, { volume });

    const formateTime = (k) => {
        return k < 10 ? "0" + k : k;
    }

    const getTime = () => {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        hour = formateTime(hour);
        min = formateTime(min);
        return hour + ":" + min;
    }

    useEffect(()=>{
        setLoop(setInterval(() => { setTime(getTime())}, 1000))
        return () =>{ clearInterval(loop)}
    },[])
    return <div className={styles.main}>
        <div className={styles.container}>
            <Navigatablechild x="1" y="0"><Fab onClick={chatPlay} className={styles.red}><Badge badgeContent={4} color="primary"><Chat /></Badge></Fab></Navigatablechild>
            <Navigatablechild x="2" y="0"><Fab onClick={eshopPlay} className={styles.yellow}><Shop /></Fab></Navigatablechild>
            <Navigatablechild x="3" y="0"><Fab onClick={() => {albumPlay(); setGallery(true)}} className={styles.blue}><PhotoLibrary /></Fab></Navigatablechild>
        </div>
        <div className={styles.container}>
            <div>{time}</div>
            <div><Wifi /></div>
            <div><Battery80 /></div>
        </div>
    </div>
}

export default Header