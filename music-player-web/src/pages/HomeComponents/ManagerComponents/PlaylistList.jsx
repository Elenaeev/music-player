import { useContext, useEffect, useRef, useState } from "react";
import PlaylistCard from "./PlaylistCard";
import axios from "axios";
import { PlaylistContext } from "../../context/PlaylistContext";
import { TrackListContext } from "../../context/TrackListContext";
import NewPlaylistDialog from "./NewPlaylistDialog";

export default function PlaylistsList() {
    
    const { handleUpdatePlaylistsList, playlists } = useContext(PlaylistContext);
    const { openDialog } = useContext(TrackListContext);
    const [ loading, setLoading ] = useState(false);

    const dialogRef = useRef(null);

    useEffect(() => {
        setLoading(false);
    }, [playlists])

    return (
        <>
            
            {        
                loading?
                (
                    <h1>loading....</h1>
                ) :
                (
                    <>
                        <button onClick={() => {openDialog(dialogRef)}} className="items-start bg-transparent p-1 pl-2 pr-2 rounded-md hover:bg-white transition-colors cursor-pointer"><i className="fa-solid fa-plus text-(--color-bright)"></i> New playlist</button>
                        {
                            playlists?
                            (
                                playlists.map((playlist, playlistIndex) => {
                                    return (
                                        <PlaylistCard key={playlistIndex} playlist={playlist}/>
                                    )
                                })
                            ) : (<>oh no...</>)
                        }
                    </>
                    

                )
                
            }
            <NewPlaylistDialog dialogRef={dialogRef} setLoading={setLoading}/>
        </>
    )
}