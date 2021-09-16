 import { useState, useEffect, useRef } from "react"
import { useNavFocusMode, setFocus } from "./Navigation-Singleton-Hook";

const Navigatablecontainer = ({ navigationID, children}) => {//{navigationID, children}

    useEffect(() => {
        
    },[])
    return (<div>{children}</div>)
}

const Navigatablechild = ({ x, y, children, className = "", ...restProps }) => {
    const { xIndex, yIndex, pressed} = useNavFocusMode();
    const [isActive, setIsActive] = useState(false);
    
    const ref = useRef();
    x = parseInt(x);
    y = parseInt(y);

    const setInFocus = () => {
        setIsActive(true);
        setFocus({ xIndex: x, yIndex: y , pressed:false})
    }

    const removeActive = () => {
        setIsActive(false)
    }

    useEffect(()=>{
        if(x!=xIndex || y!=yIndex ){
            if (isActive) setIsActive(false)
            return
        }
        if(x==xIndex && y==yIndex){
            setIsActive(true);
            if (pressed) {
                ref.current.firstChild.click();
                setFocus({ xIndex: x, yIndex: y, pressed: false })
            }
        }

        
    }, [xIndex, yIndex, pressed])

    return <div ref={ref} className={`${className} navChild ${isActive?" Active":""}`} onMouseEnter={setInFocus}
        onMouseLeave={removeActive} {...restProps}>
        {children}
    </ div>
}

export default Navigatablechild;
export { Navigatablecontainer} ;