import { useContext } from "react";
import { TrackListContext } from "../../context/TrackListContext";

export default function DeleteDialog ({ track, selectedPlaylistId, dialogRef, isSamePlaylist }) {
    const { closeDialog, handleDeleteTrack  } = useContext(TrackListContext);

    return (
        <dialog onClick={(e)=>{e.stopPropagation();}} ref={dialogRef} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl h-40 w-100 p-5 pt-0">
            <div className="h-27 items-center justify-center flex">
                <h2 className="h-auto">Are you sure you want to delete this track?</h2>
            </div>
            
            <div className="flex flex-row gap-2 h-8">
            <button onClick={(e) => {e.stopPropagation(); handleDeleteTrack(track.id, selectedPlaylistId, isSamePlaylist); closeDialog(dialogRef)}} className="bg-(--color-bright) h-8 w-full text-white p-2 flex items-center justify-center rounded-md">
                    <h2>Yes</h2>
                </button>
            <button onClick={(e) => {e.stopPropagation(); closeDialog(dialogRef)}} className="bg-(--color-bg-one) h-8 w-full text-black p-2 flex items-center justify-center rounded-md">
                   <h2>No</h2>
            </button>
            </div>
            
        </dialog> 
    )
}