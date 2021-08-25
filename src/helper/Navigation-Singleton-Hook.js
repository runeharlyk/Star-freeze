
import { singletonHook } from 'react-singleton-hook';
import { useState, useEffect } from 'react';
import Nexus from './Nexus';

const initFocus = { xIndex: 0, yIndex: 0 };
let globalSetFocus = () => { throw new Error('you must useDarkMode before setting its state'); };

export const useNavFocusMode = singletonHook(initFocus, () => {
    const [focus, setFocus] = useState(initFocus);
    globalSetFocus = setFocus;

    const updateFocus = (x, y) => {
        setFocus(foc => ({xIndex:foc.xIndex+x, yIndex:foc.yIndex+y}));
    }

    const handleKeypress = (event) => {
        switch (event.keyCode) {
            case 39:
                updateFocus(1, 0);
                //setXIndex(x => x + 1);
                break;
            case 37:
                updateFocus(- 1,0);
                //setXIndex(x => x - 1);
                break;
            case 38:
                //setYIndex(y => y - 1);
                updateFocus(0, -1);
                break;
            case 40:
                updateFocus(0, 1);
                //setYIndex(y => y + 1);
                break;
            case 13:
                console.log("SetActive");
            default:
                break;
        }
    }

    useEffect(() => {
        Nexus.on("message", message => {
            if (message.type !== "joystick") return
            var y = Math.sin(message.angle * (Math.PI / 180)) * (message.distance / 5) * -1;
            var x = Math.cos(message.angle * (Math.PI / 180)) * (message.distance / 5);
            if (Math.abs(x) > Math.abs(y)){
                if (x < -5) updateFocus(-1, 0);
                else if (x > 5) updateFocus(1, 0);
            }else {
                if (y < -5) updateFocus(0, -1);
                else if (y > 5) updateFocus(0, 1);
            }
        })

        document.addEventListener("keydown", handleKeypress)

        return () => {
            document.removeEventListener("keydown", handleKeypress)
        }
    }, [])

    return focus;
});

export const setFocus = focus => globalSetFocus(focus);