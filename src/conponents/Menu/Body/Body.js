import styles from './Body.module.css'
import Games from '../Games/Games';
const Body = () => {
    return <div className={styles.main}>
        <Games />
    </div>
}

export default Body