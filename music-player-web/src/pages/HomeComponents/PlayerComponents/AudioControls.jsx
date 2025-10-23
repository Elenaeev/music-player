import { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import VolumeControl from "./VolumeControl";
import RepeatButton from "./RepeatButton";
import AddToPlaylistButton from "./AddToPlaylistButton";


export default function AudioControls() {

    const { isPlaying, handlePause, handlePlay, handleChangeRepeat, handlePlayNext, handleGotoStartOrPlayPrevious } = useContext(PlayerContext);

    return (
        <div className="grid grid-cols-[repeat(6,_45px)] items-center justify-center gap-1 w-max place-items-center">
            <VolumeControl/>
                                
            <button 
                onClick={handleGotoStartOrPlayPrevious} 
                className="h-fit flex items-center hover:scale-120 transition-transform"
            >
                <i 
                    className="fa-solid fa-backward-step text-3xl text-(--color-text) hover:text-(--color-bright) cursor-pointer"></i>
            </button>

            {
                isPlaying //context
                ? (<button onClick={handlePause} className="h-fit w-7 flex items-center justify-center hover:scale-120 transition-transform"><i className="fa-solid fa-pause text-3xl text-(--color-text) hover:text-(--color-bright)"></i></button>)
                :(<button onClick={handlePlay} className="h-fit w-7 flex items-center justify-center hover:scale-120 transition-transform"><i className="fa-solid fa-play text-3xl text-(--color-text) hover:text-(--color-bright)"></i></button>)
            }
            <button 
                onClick={handlePlayNext} 
                className="h-fit flex items-center hover:scale-120 transition-transform"
            >
                <i className="fa-solid fa-forward-step text-3xl text-(--color-text) hover:text-(--color-bright) cursor-pointer"></i>
            </button>
            <RepeatButton/>
            <AddToPlaylistButton/>
        </div>
    )
}