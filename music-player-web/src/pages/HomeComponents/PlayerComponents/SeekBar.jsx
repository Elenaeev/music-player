import { useContext, useEffect, useState } from "react"
import { PlayerContext } from "../../context/PlayerContext"

export default function SeekBar() {

    const { duration, currentTime, handleSeek, formatDuration } = useContext(PlayerContext);

    const [width, setWidth] = useState(50);
    const [isSeeking, setIsSeeking] = useState(false);


    useEffect(() => {
        setWidth((currentTime/duration)*100);
    }, [currentTime])

    return (
        <div className="w-full flex flex-col relative">
            <input 
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                onMouseDown={() => {setIsSeeking(true)}}
                onMouseEnter={() => {setIsSeeking(true)}}
                onMouseUp={() => {setIsSeeking(false)}}
                onMouseLeave={() => {setIsSeeking(false)}}
                className="w-full z-10 opacity-0"                    
            />
            <div className="flex flex-row justify-between">
                <p>{formatDuration(currentTime)}</p>
                <p>{formatDuration(duration)}</p>
            </div>

            <div className="h-2 w-full bg-white rounded-full absolute top-0.5" >
                <div className="h-full relative rounded-l-full flex flex-row items-center justify-end bg-(--color-bright)" style={{ width: `${width}%` }}>
                    {/* <div className={"bg-(--color-bright) transition-all rounded-full " + (isSeeking? "size-4" : "size-2")}>

                    </div> */}
                    <div className="size-2 ml-2 bg-transparent transition-all rounded-full relative justify-center ">
                        <div className={"size-2 bg-(--color-bright) transition-all rounded-full ml-1 " + (isSeeking? "scale-200" : "")}>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}