import React, { Suspense, useState, useRef, useEffect } from 'react'
import { useLoader, Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from "three";
import { useProgress, Html, Center, Stars, Cloud, CameraShake, Effects, Environment, FlyControls, Sky } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Nexus from '../helper/Nexus';
import { PhoneEnabled } from '@material-ui/icons';
import { ArrowHelper } from 'three';

var threejs_quaternion = new THREE.Quaternion();
var baseQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
var threejs_quaternion_offsets = new THREE.Quaternion(-0.49815297449383966, -0.4115880994007512, -0.5126473496172514, 0.5653596601854652);
var _q = new THREE.Quaternion();
var _Q = new THREE.Quaternion();
var dir = new THREE.Vector3(0, 0, 0)
//var world_transform = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

function Loader() {
    const { total } = useProgress()
    return <Html center>{Math.floor(total)} % loaded</Html>
}

const Jet = (position) => {
    const gltf = useLoader(GLTFLoader, './models/Jet.glb')
    const ref = useRef();
    const jet = useRef();
    const {camera} = useThree();
    useEffect( () => {
        Nexus.on("message", message => {
            if (message.type === "deviceMotion") threejs_quaternion.set(message.motion.x, message.motion.y, message.motion.z, message.motion.w);
            else if (message.type === "bpress") 
                if (message.state === 1 && message.button === "home") {
                    threejs_quaternion_offsets.copy(threejs_quaternion).invert();
                    console.log(threejs_quaternion_offsets);
                }
        })
    },[])

    useFrame(() => {
        _Q = new THREE.Quaternion();
        _Q.multiply(baseQ)
        _q.multiplyQuaternions(threejs_quaternion_offsets, threejs_quaternion)
        _Q.multiply(_q)
        ref.current.quaternion.slerp(_Q, 0.3);
        jet.current.quaternion.slerp(_Q, 0.3);


        var direction = new THREE.Vector3(0.1, 0.1,-1).applyQuaternion(_Q).negate();
        var speed = 2;
        var vector = direction.multiplyScalar(speed, speed, speed);
        jet.current.position.x += vector.x;
        jet.current.position.y += vector.y;
        jet.current.position.z += vector.z;


        // * ROTATE CAMERA AROUND jet.current.position* //
        const idealOffset = new THREE.Vector3(4.9, 10, 20);
        idealOffset.applyQuaternion(_Q.multiply(baseQ));
        idealOffset.add(jet.current.position);

        camera.position.lerp(idealOffset, 0.03)
        camera.lookAt(jet.current.position)
        
    })

    return (<>
        <mesh position={[0,0,0]} ref={ref}>
            <boxBufferGeometry args={[1, 4, 0.4]} attach="geometry" />
            <meshPhongMaterial color="green" transparent opacity={0.6} attach="material" />
            <axesHelper />
            <arrowHelper args={[, , 3, 0x000]} />
        </mesh>
        <primitive ref={jet} scale={[0.1,0.1,0.1]} object={gltf.scene} />
        </>
    )
}

function WuhuIsland(props) {
    const gltf = useLoader(GLTFLoader, './models/Wuhu_Island.glb')
    const gltfR = useLoader(GLTFLoader, './models/Wuhu_IslandR.glb')
    const skybox = useLoader(GLTFLoader, './models/skybox.glb')
    const world = useRef();
    const worldR = useRef();
    const skyBox = useRef();
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useEffect(() => {
        world.current.rotation.x = 180
        worldR.current.rotation.x = 180
        //skyBox.current.rotation.x = 180
    },[])

    return (
        <>
            <arrowHelper args={[, , 100, 0x000]} />
            <primitive scale={[0.1, 0.1, 0.1]} position={props.position} ref={world} object={gltf.scene} />
            <primitive scale={[0.1, 0.1, 0.1]} position={props.position} ref={worldR} object={gltfR.scene} />
            
        </>
    )
}

/*<mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 2, 3]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh> */

function Camera(props) {
    const ref = useRef()
    const set = useThree(state => state.set)
    // Make the camera known to the system
    useEffect(() => void set({ camera: ref.current }), [])
    useEffect(() => {
        ref.current.position.z = 0;
        ref.current.position.y =4000
        
        ref.current.far = 5000;
        ref.current.rotation.x = THREE.MathUtils.degToRad(-90);
    },[])
    useFrame(() => {
        
    })
    return <perspectiveCamera ref={ref} {...props} />
}

const Flight = () => {
    const config = {
        maxYaw: 0.01, // Max amount camera can yaw in either direction
        maxPitch: 0.01, // Max amount camera can pitch in either direction
        maxRoll: 0.01, // Max amount camera can roll in either direction
        yawFrequency: 4, // Frequency of the the yaw rotation
        pitchFrequency: 4, // Frequency of the pitch rotation
        rollFrequency: 4, // Frequency of the roll rotation
        intensity: 0.3, // initial intensity of the shake
        decay: false, // should the intensity decay over time
        decayRate: 0.65, // if decay = true this is the rate at which intensity will reduce at
        controls: undefined, // if using orbit controls, pass a ref here so we can update the rotation
    }
    useEffect(()=>{
        Object.keys(Nexus.peerConnections).forEach((uuid) => {
            //Nexus.send({ 'type': 'enable', 'feature': 'devicemotion' }, uuid)
            Nexus.send({ 'type': 'controller', 'id':1 }, uuid)
        });
    },[])
    return <Canvas className="game">
        <Suspense fallback={<Loader />} >
        <Camera />           
            {[...Array(600)].map((x, i) =>
                <mesh position={[Math.ceil(Math.random() * 5000) * (Math.round(Math.random()) ? 1 : -1), Math.ceil(Math.random() * 400) * (Math.round(Math.random()) ? 1 : -1), Math.ceil(Math.random() * 5000) * (Math.round(Math.random()) ? 1 : -1)]}>
                    <boxBufferGeometry args={[10,10,10]} attach="geometry" />
                    <meshPhongMaterial color="green" opacity={1} attach="material" />
                    <axesHelper />
                </mesh>
            )}
            <ambientLight intensity={0.1} />
            <directionalLight color="#ffffff" intensity={0.5} position={[-1, 200, 4]} />
            <Jet position={[0, 0, 0]} />
            <WuhuIsland position={[0, 0, 0]} />
            
        </Suspense>
</Canvas>
}
//<Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
//<CameraShake {...config} />
//PositionalAudio
export default Flight;

//