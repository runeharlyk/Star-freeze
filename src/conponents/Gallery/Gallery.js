import styles from './Gallery.module.css'
import { useState, useEffect } from 'react'
import { Fab, Badge } from '@material-ui/core'
import { Shop, PhotoLibrary, Chat, Wifi, Battery80 } from '@material-ui/icons'
import Navigatablechild from '../../helper/Navigation'
import ScreenShot from '../../helper/ScreenShot'
import Modal from '../Modal/Modal'

const Gallery = () => {
    const [images, setImages] = useState([{'src':'dumbshit'}]);
    useEffect(() => {
        const imgs = ScreenShot.retrieveLocal();
        setImages(imgs);
    }, [])
    return <Modal title={
            <><PhotoLibrary />   Album</>
        }
        righttitle={
            <div>All screenshots ({images.length})</div>
        }
        >
        <div className={styles.imgcontainer}>
            {images.map((image, i) => (
                <Navigatablechild className={styles.imgnav} x={i} y={Math.floor(i / 5)}><img className={styles.img} alt={image.name} src={`data:image/png;base64, ${image.src}`} /> </ Navigatablechild>
            ))}
            </div>
        </Modal>
}

export default Gallery