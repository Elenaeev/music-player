import { useContext, useState } from "react"
import { TrackListContext } from "../../context/TrackListContext"
import { PlaylistContext } from "../../context/PlaylistContext";

export default function AddToPlaylistDialog({ dialogRef, track }) {

    const { openDialog, closeDialog, AddToPlaylistAndUpdate, } = useContext(TrackListContext);
    const { playlists } = useContext(PlaylistContext);
    const [menuOpened, setMenuOpened] = useState(false);
    const [playlistSelected, setPlaylistSelected] = useState(null);

    const handleToggleMenu = () => {
        setMenuOpened(!menuOpened);
    }

    return (
        <dialog ref={dialogRef} className="w-100 h-max bg-white flex-col rounded-xl p-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div onClick={(e)=> {e.stopPropagation(); handleToggleMenu();}} className="h-10 rounded-md border-2 bg-white border-(--color-bg-two) flex pl-2 pr-2 items-center justify-between">
                {
                    (playlistSelected!=null)? 
                    (
                        <h1 className="text-black">{playlistSelected.name}</h1>
                    ) :
                    (
                        <h1 className="text-gray-400">Select playlist...</h1>
                    )
                    
                }

                {
                    menuOpened? 
                    (
                        <i className="fa-solid fa-chevron-up"></i>
                    ) :
                    (
                        <i className="fa-solid fa-chevron-down"></i>
                    )
                }

            </div>
            <div className={"border-2 border-(--color-bg-two) rounded-b-md bg-white relative -z-10 pt-2 -mt-2 transition-all " + (menuOpened? "h-40" : "h-0 opacity-0")}>
                <div className="overflow-y-scroll h-full">
                {
                    (
                        playlists?
                        (
                            playlists.map((playlist, index)=> {
                                return (
                                    <div key={index}>
                                        <div onClick={(e) => {e.stopPropagation();setPlaylistSelected(playlist)}} className="h-10 ml-2 mr-2 flex rounded-sm flex-col cursor-pointer items-center justify-center hover:bg-gray-100">
                                            <h1 >{playlist.name}</h1>
                                        </div>
                                        <div className="h-0.25 bg-gray-400 ml-4 mr-4"></div>
                                    </ div>

                                )
                            })
                        ) : (<></>)

                    )
                }
                </div>
            </div>
            
            <div className="flex flex-row gap-2 h-8 mt-2">
                {
                    (playlistSelected!=null)?
                    (
                        <button onClick={(e) => {
                            e.stopPropagation(); 
                            console.log(track);
                            console.log(playlistSelected);
                            AddToPlaylistAndUpdate(track.id, playlistSelected.id);
                            closeDialog(dialogRef); 
                            setPlaylistSelected(null); 
                            setMenuOpened(false);
                        }} className="bg-(--color-bright) h-8 w-full text-white p-2 flex items-center justify-center rounded-md">
                            <h2>Confirm</h2>
                        </button>                        
                    ) :
                    (
                        <></>
                    )

                }
                <button onClick={(e) => {e.stopPropagation(); closeDialog(dialogRef); setPlaylistSelected(null); setMenuOpened(false);}} className="bg-(--color-bg-one) h-8 w-full text-black p-2 flex items-center justify-center rounded-md">
                    <h2>Cancel</h2>
                </button>
            
            </div>
            
        </dialog>
    )
}