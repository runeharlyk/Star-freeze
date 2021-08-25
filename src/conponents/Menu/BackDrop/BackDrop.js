import styles from './BackDrop.module.css'

const BackDrop = (props) => {
    return <div className={styles.main}>
        <img className={styles.backdropImage} alt="Backdrop" src={props.image} />
    </div>
}

export default BackDrop