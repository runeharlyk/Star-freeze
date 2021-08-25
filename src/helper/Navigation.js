 import { useState, useEffect } from "react"
 import { useNavFocusMode, setFocus } from "./Navigation-Singleton-Hook";

const Navigatablecontainer = ({ navigationID, children}) => {//{navigationID, children}

    useEffect(() => {
    },[])
    return (<div>{children}</div>)
}

const Navigatablechild = ({ x, y, children, className = "", ...restProps }) => {
    const { xIndex, yIndex} = useNavFocusMode();
    const [isActive, setIsActive] = useState(false);
    x = parseInt(x);
    y = parseInt(y);

    const setInFocus = () => {
        setIsActive(true);
        setFocus({ xIndex: x, yIndex: y })
    }

    const removeActive = () => {
        setIsActive(false)
    }

    useEffect(()=>{
        if(x!=xIndex || y!=yIndex ){
            if (isActive) setIsActive(false)
            return
        }
        if(x==xIndex && y==yIndex)setIsActive(true);
    }, [xIndex, yIndex])

    return <div className={`${className} navChild ${isActive?" Active":""}`} onMouseEnter={setInFocus}
        onMouseLeave={removeActive} {...restProps}>
        {children}
    </ div>
}

export default Navigatablechild;
export { Navigatablecontainer} ;