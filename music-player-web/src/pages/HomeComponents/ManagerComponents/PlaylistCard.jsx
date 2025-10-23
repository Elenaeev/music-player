import { useContext, useEffect, useRef } from "react"
import { PlaylistContext } from "../../context/PlaylistContext"
import DeletePlaylistDialog from "./DeletePlaylistDialog";
import { TrackListContext } from "../../context/TrackListContext";

export default function PlaylistCard({ playlist }) {
    const { setDisplayedPlaylist, displayedPlaylist } = useContext(PlaylistContext);    
    const { openDialog } = useContext(TrackListContext);
    const dialogRef = useRef(null);

    return (
        <div>
            <div onClick={() => {setDisplayedPlaylist(playlist);}} className="w-full group flex flex-row gap-2 hover:bg-white rounded-md h-12 items-center justify-between pl-3 pr-3 cursor-pointer">
                <i className="fa-solid fa-list text-gray-400 group-hover:text-(--color-bg-two) text-xl w-5"></i>
                <div className="flex w-full min-w-0 items-center gap-2 text-center">
                    <div className="flex flex-col min-w-0 w-full">
                        <h6 className="text-md truncate w-full text-start">{playlist.name}</h6>
                        <h6 className="text-gray-400 font-medium text-sm w-full text-start mb-1 -mt-1">{playlist.track_count + ((playlist.track_count == 1) ? " track" : " tracks")}</h6>
                    </div>

                </div>

                <div className="flex flex-row gap-3 justify-center h-5">
                    <button  
                        onClick={(e) => {e.stopPropagation(); openDialog(dialogRef);}} 
                        className="hidden group-hover:block cursor-pointer group"
                    >
                        <i className="fa-solid fa-xmark text-gray-300 text-xl hover:text-red-400"></i>
                    </button>
                </div>
                
            </div>
            <DeletePlaylistDialog playlist={playlist} dialogRef={dialogRef}/>
        </div>
        
        
    )
}