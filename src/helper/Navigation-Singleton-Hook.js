
import { singletonHook } from 'react-singleton-hook';
import { useState, useEffect } from 'react';
import Nexus from './Nexus';
/* import useSound from 'use-sound';
import { useStateManager } from './useStateManager';
import nockSound from '../sounds/Nock.wav' */


const initFocus = { xIndex: 0, yIndex: 0, pressed:false };
let globalSetFocus = () => { throw new Error('you must useDarkMode before setting its state'); };

export const useNavFocusMode = singletonHook(initFocus, () => {
    const [focus, setFocus] = useState(initFocus);
    //const {volume} = useStateManager();
    //const [nock] = useSound(nockSound, {volume, interrupt:true});
    let joystickflag = false;
    globalSetFocus = setFocus;

    const updateFocus = (x, y, pressed) => {
        //if(focus.xIndex+x<0 || focus.yIndex+y < 0 )return
        setFocus(foc => ({xIndex:foc.xIndex+x, yIndex:foc.yIndex+y, pressed}));
        joystickflag = true;
    }

    const handleKeypress = (event) => {
        switch (event.keyCode) {
            case 39:
                updateFocus(1, 0, false);
                //setXIndex(x => x + 1);
                break;
            case 37:
                updateFocus(- 1, 0, false);
                //setXIndex(x => x - 1);
                break;
            case 38:
                //setYIndex(y => y - 1);
                updateFocus(0, -1, false);
                break;
            case 40:
                updateFocus(0, 1, false);
                //setYIndex(y => y + 1);
                break;
            case 13:
                updateFocus(0, 0, true);
            default:
                break;
        }
    }

    useEffect(() => {
        Nexus.on("message", message => {
            //if (message.type !== "joystick" || message.type !== "bpress") return
                if(message.type === "joystick"){
                var y = Math.sin(message.angle * (Math.PI / 180)) * (message.distance / 5) * -1;
                var x = Math.cos(message.angle * (Math.PI / 180)) * (message.distance / 5);

                if (Math.abs(x) < 6 && Math.abs(y) < 6) joystickflag = false;
                if (!joystickflag && (Math.abs(x) > 6 || Math.abs(y) > 6)){
                    if (Math.abs(x) > Math.abs(y)){
                        if (x < -6) updateFocus(-1, 0,false);
                        else if (x > 6) updateFocus(1, 0, false);
                    }else {
                        if (y < -6) updateFocus(0, -1, false);
                        else if (y > 6) updateFocus(0, 1, false);
                    }
                }
            }else if(message.type === "bpress") {
                console.log(message.button === "b" && message.state === 0);
                if(message.button === "b" && message.state === 0) updateFocus(0,0,true);
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