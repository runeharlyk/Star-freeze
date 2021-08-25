import styles from './Footer.module.css'
import { Computer } from '@material-ui/icons'
import Controller from '../../Controller/Controller'

const Footer = () => {
    return <div className={styles.main}>
        <div className={styles.container}>
            <div><Controller /></div>
            <div className="centerItem"><Computer /></div>
        </div>
    </div>
}

export default Footer