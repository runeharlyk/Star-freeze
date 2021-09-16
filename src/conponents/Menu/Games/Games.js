import styles from './Games.module.css'
import {useState ,useEffect, useRef } from 'react'
import Navigatablechild from '../../../helper/Navigation';
import { useSpring, animated, config } from "react-spring";
import { WebAsset } from '@material-ui/icons'
import useSound from 'use-sound';
import LaunchSound from '../../../sounds/Popup + Run Title.wav'
import { useStateManager } from '../../../helper/useStateManager';

const gamesJson = [{
    "id": 0,
    "name": "Island flyover",
    "img_src": "https://developer.runeharlyk.dk/Explore/files/The-Impecunious/games/planeimage.PNG",
    "controller_id": 0,
},
{
    "id": 1,
    "name": "Mario Kart 8 Deluxe",
    "img_src": "https://s3.gaming-cdn.com/images/products/2615/orig/mario-kart-8-deluxe-switch-cover.jpg",
    "controller_id": 1,
},
{
    "id": 2,
    "name": "Vr camera demo",
    "img_src": "https://developer.runeharlyk.dk/Explore/files/The-Impecunious/games/simpleplatform/cover.PNG",
    "controller_id": 1,
},
{
    "id": 3,
    "name": "Vr camera demo",
    "img_src": "https://developer.runeharlyk.dk/Explore/files/The-Impecunious/games/virtuelWorld/resources/textures/cube/Beach/negz.jpg",
    "controller_id": 1,
},
{
    "id": 4,
    "name": "Vr camera demo",
    "img_src": "https://developer.runeharlyk.dk/Explore/files/The-Impecunious/games/simpleplatform/cover.PNG",
    "controller_id": 1,
}
    ,
{
    "id": 5,
    "name": "Vr camera demo",
    "img_src": "https://developer.runeharlyk.dk/Explore/files/The-Impecunious/games/virtuelWorld/resources/textures/cube/Beach/negz.jpg",
    "controller_id": 1,
}
    ,
{
    "id": 6,
    "name": "Vr camera demo",
    "img_src": "https://developer.runeharlyk.dk/Explore/files/The-Impecunious/games/simpleplatform/cover.PNG",
    "controller_id": 1,
    },
    {
        "id": 7,
        "name": "The Lengend of Zelda: Breath of the Wild",
        "img_src": "https://s01.riotpixels.net/data/93/2f/932f6518-afcf-46fb-88e8-7105ea306f73.jpg/cover.legend-of-zelda-breath-of-the-wild.1000x1363.2017-08-24.147.jpg",
        "controller_id": 0,
    },
];

const calc = (x, y, ref) => [-(y - window.innerHeight / 2) / 20, (x - (ref.current.getBoundingClientRect().left + ref.current.getBoundingClientRect().width/2)) / 20, 1]
const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

const GameCard = (prop) => {
    const {setGame, volume} = useStateManager()
    const [playLaunch] = useSound(LaunchSound, { volume });
    const [props, set] = useSpring(() => ({ xys: [0, 0, 1], config: config.default }))
    const refference = useRef();
    return (
        <animated.div onClick={() => {playLaunch();setGame(prop.game.id)}} ref={refference} className={styles.hovercard} onMouseMove={({ clientX: x, clientY: y }) => (set({ xys: calc(x, y, refference) }))}
        onMouseLeave={() => set({ xys: [0, 0, 1] })}
        style={{
        transform: props.xys.interpolate(trans)
        }}>
        <Navigatablechild y="1" x={prop.game.id + 1} key={prop.game.id} className={styles.gameCard}>
            <img className={styles.gameCardImage} alt={prop.game.name} src={prop.game.img_src} />
        </Navigatablechild>
    </animated.div>
    )
    
}

const Games = () => {
    const [games, setGames] = useState([]);
    
    useEffect(() => {
        setGames(gamesJson);
    },[])
    return <div className={styles.main}>
        <div className={styles.gameList} >
            {games.map((game, i)=>(
                <GameCard key={i} game={game}></GameCard>
            ))}
        </div>
    </div>
}

export default Games