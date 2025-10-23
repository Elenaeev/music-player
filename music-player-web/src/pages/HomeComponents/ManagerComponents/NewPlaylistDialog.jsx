import { useContext, useState } from "react";
import { TrackListContext } from "../../context/TrackListContext";
import { PlaylistContext } from "../../context/PlaylistContext";

export default function NewPlaylistDialog({ dialogRef, setLoading }) {

    const { closeDialog } = useContext(TrackListContext);
    const { handleCreateNewPlaylist } = useContext(PlaylistContext);
    
    const [newPlaylistName, setNewPlaylistName] = useState('');


    return (
        <dialog ref={dialogRef} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl h-26 w-100 p-2 flex-col gap-2">
            <input
                className="bg-gray-200 rounded-lg h-10 w-full mb-2 focus:outline-(--color-bright) p-2" 
                required
                maxLength="100"
                type="text" 
                placeholder="Name"
                onChange={(e) => {setNewPlaylistName(e.target.value)}}
                value={newPlaylistName}
            />
            <div className="flex flex-row gap-2 h-10">
                <input onClick={(e) => {e.preventDefault();setLoading(true); handleCreateNewPlaylist(newPlaylistName); setNewPlaylistName(''); closeDialog(dialogRef)}} type="submit" value="Create" className="w-full bg-(--color-bright) text-white rounded-lg"></input>
                <button onClick={(e) => {e.stopPropagation(); closeDialog(dialogRef);}} className="rounded-lg w-full bg-(--color-bg-one) text-(--color-text)">Cancel</button>
            </div>
        </dialog>
    )
}