import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { TrackListContext } from "../../context/TrackListContext";
import { PlaylistContext } from "../../context/PlaylistContext";
import DeleteDialog from "./DeleteDialog";
import TrackMenu from "./TrackMenu";

export default function TrackCard({ track, trackIndex }) {

    const { formatDuration, isPlaying, handlePlay, handlePause, setSelectedTrackIndex  } = useContext(PlayerContext);
    const { selectedTrack, setSelectedTrack, displayedTrackList, setSelectedTrackList, selectedTrackList, openDialog, closeDialog, handleDeleteTrack } = useContext(TrackListContext);
    const { displayedPlaylist, selectedPlaylistId, setSelectedPlaylistId } = useContext(PlaylistContext);
    const [isSelected, setIsSelected] = useState(false);
    const [isSamePlaylist, setIsSamePlaylist] = useState(false); //displayed tracklist and selected track list are the same
    const [menuOpened, setMenuOpened] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const menuRef = useRef(null);

const handleClick = (event) => {
    const margin = 0; 

    const menuWidth = 200; 
    const menuHeight = 150; 

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = event.clientX;
    let y = event.clientY;

    if (x + menuWidth > viewportWidth) {
        x = viewportWidth - menuWidth - margin;
    }
    if (y + menuHeight > viewportHeight) {
        y = viewportHeight - menuHeight - margin;
    }

    setMenuPosition({ x, y });
    setMenuOpened(true);
};

    const dialogRef = useRef(null);

    const handleSelectTrack = () => {
        //const isSamePlaylist = (!selectedPlaylistId && !displayedPlaylist) || (displayedPlaylist && displayedPlaylist.id === selectedPlaylistId);
        console.log(`Playlist Match: ${isSamePlaylist}`);

        if(isSelected && isSamePlaylist) {
            if(isPlaying) {
                handlePause();
            } else {
                handlePlay();
            }
            
        } else{
            setSelectedTrack(track); 
            setSelectedTrackIndex(trackIndex);
            setSelectedTrackList(displayedTrackList);
            if(displayedPlaylist) {
                console.log(`FROM PLAYLIST ${displayedPlaylist.id}`)
                setSelectedPlaylistId(displayedPlaylist.id);
            } else {
                console.log(`NOT FROM PLAYLIST`)
                setSelectedPlaylistId(null);
            }
            
        }
    }

    useEffect(() => {
        if (selectedTrack && track) {
            const isSameTrack = selectedTrack.id === track.id;
            // const isSamePlaylist = (!selectedPlaylistId && !displayedPlaylist) || (displayedPlaylist && displayedPlaylist.id === selectedPlaylistId);

            // console.log(`Track Match: ${isSameTrack}, Playlist Match: ${isSamePlaylist}`);
            // console.log(`Selected: ${selectedTrack.meta_title} (${selectedTrack.id})`);
            // console.log(`Current: ${track.meta_title} (${track.id})`);

            // setIsSelected(isSameTrack && isSamePlaylist);
            setIsSelected(isSameTrack);
        }
    }, [selectedTrack, displayedPlaylist, track, selectedPlaylistId]);

    useEffect(() => {
        setIsSamePlaylist((!selectedPlaylistId && !displayedPlaylist) || (displayedPlaylist && displayedPlaylist.id === selectedPlaylistId))
    }, [selectedTrack, displayedPlaylist, selectedPlaylistId])


    return (
        <>
            <div 
                onClick={handleSelectTrack} 
                className={"w-full x-100 group flex flex-row hover:bg-white rounded-md h-12 items-center justify-between pl-3 pr-3 cursor-pointer " + ((isSelected) ? "bg-white text-(--color-bright) font-bold" : "bg-transparent")}
            >
                
                <div className="flex w-full min-w-0 items-center gap-2 text-center">
                    {
                        (isSelected) 
                        ? ((isPlaying)? ((isSamePlaylist)?(<i className="fa-solid fa-compact-disc text-(--color-bright) text-md w-5"></i>):(<i className="fa-solid fa-play text-(--color-bright) group-hover:text-(--color-bg-two) text-xl w-5"></i>)):(<i className="fa-solid fa-pause text-(--color-bright) text-xl w-5"></i>))
                        : (<i className="fa-solid fa-play text-gray-400 group-hover:text-(--color-bg-two) text-xl w-5"></i>)
                    }
                    <div className="flex flex-col min-w-0 w-full">
                        <h6 className="text-md truncate w-full text-start ">
                        {
                            (track.title == "")? ((track.meta_title == "Untitled") ? (track.audio_file.substring(track.audio_file.lastIndexOf("/") + 1, track.audio_file.lastIndexOf("."))) : (track.meta_title)) : (track.title)
                        }
                        </h6>
                        <h6 className="text-gray-400 truncate font-medium text-sm w-full text-start mb-1 -mt-1">{track.meta_artist}</h6>
                    </div>

                </div>

                <div className="grid grid-cols-[repeat(2,_max-content)] group-hover:grid-cols-[repeat(3,_max-content)] h-5 gap-3 text-center items-center justify-center">
                    <div className="h-full w-full flex justify-center items-center ">
                        <h3 className="text-sm text-gray-500 mb-0.5">
                            {formatDuration(track.duration)}
                        </h3>
                    </div>
                    
                    
                    
                    <button  onClick={(e) => {e.stopPropagation(); openDialog(dialogRef); console.log(selectedPlaylistId);}} className="hidden group-hover:flex cursor-pointer group flex-col">
                        <i className="fa-solid fa-xmark text-gray-300 text-xl hover:text-red-400"></i>
                    </button>
                    <button 
                    onClick={(e)=>{e.stopPropagation(); handleClick(e);}}
                    //  onMouseLeave={()=>{
                    //     setTimeout(() => {
                    //         setMenuOpened(false);
                    //     }, 300);
                    // }} 
                    className="flex flex-col justify-center items-center cursor-pointer">
                        <i className="fa-solid fa-ellipsis text-gray-300  hover:text-(--color-bright)"></i>
                    </button>

                    
                </div>
            </div>
                <div 
                    ref={menuRef}
                    className="absolute z-10"
                    style={{
                            top: menuPosition.y,
                            left: menuPosition.x,
                        }}
                >
                    <TrackMenu track={track} isSamePlaylist={isSamePlaylist} displayedPlaylist={displayedPlaylist} menuOpened={menuOpened} setMenuOpened={setMenuOpened} menuRef={menuRef}/>
                </div>
            <DeleteDialog dialogRef={dialogRef} selectedPlaylistId={displayedPlaylist? displayedPlaylist.id : null} track={track} isSamePlaylist={isSamePlaylist}/>
        </>

    )
}