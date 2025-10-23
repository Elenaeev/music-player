import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import SeekBar from './PlayerComponents/SeekBar';
import AudioControls from './PlayerComponents/AudioControls';
import { TrackListContext } from '../context/TrackListContext';

export default function Player() {
    const { isPlaying, audioRef} = useContext(PlayerContext);
    const { selectedTrack } = useContext(TrackListContext);
    const dialogRef = useRef(null);

    return (
        <div className="h-fit w-80 flex flex-col items-center justify-center gap-3 pb-20">
            <audio ref={audioRef}/>
            <img src="05_default.svg" draggable="false" alt="default" className={"select-none scale-130 rounded-full -z-100 size-60 " + (isPlaying ? "rotating" : "")} />
                {
                    (selectedTrack) //in context
                    ? (
                        <div className="text-center flex flex-col gap-5 w-full min-w-0 justify-center items-center">
                            <div className="w-full min-w-0">
                                <h4 className="text-gray-600 text-3xl truncate w-full">{(selectedTrack.title == "")? ((selectedTrack.meta_title == "Untitled") ? (selectedTrack.audio_file.substring(selectedTrack.audio_file.lastIndexOf("/") + 1, selectedTrack.audio_file.lastIndexOf("."))) : (selectedTrack.meta_title)) : (selectedTrack.title)}</h4>
                                <h4 className="text-gray-500 text-xl">{selectedTrack.meta_artist}</h4>
                            </div>                           
                            <AudioControls/>           
                            <SeekBar/>                           
                        </div>                       
                    )
                    : (<h4></h4>)
                }
            <dialog ref={dialogRef}></dialog>
        </div>          
    )
}