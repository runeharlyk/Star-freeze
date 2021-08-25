import { useState, useEffect } from 'react';
import compatibilityManager from './compatibilityManager'

function getFullscreenElement() {
    return document.fullscreenElement   //standard property
        || document.webkitFullscreenElement //safari/opera support
        || document.mozFullscreenElement    //firefox support
        || document.msFullscreenElement;    //ie/edge support
}

const useFullscreen = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    

    function toggleFullscreen() {
        if (getFullscreenElement()) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen().catch(console.log);
        }
    }

    useEffect(() => {
        function handleStatusChange(e) {
            setIsFullscreen(document.fullscreenElement);
        }

        document.addEventListener('fullscreenchange', handleStatusChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleStatusChange);
        };
    },[]);

    return [isFullscreen, toggleFullscreen];
}

export { useFullscreen, getFullscreenElement}