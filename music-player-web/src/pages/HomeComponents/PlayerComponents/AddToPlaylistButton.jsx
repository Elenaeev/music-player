import { useContext, useRef } from "react"
import { TrackListContext } from "../../context/TrackListContext";
import AddToPlaylistDialog from "./AddToPlaylistDialog";

export default function AddToPlaylistButton() {
    const dialogRef = useRef(null);
    const { openDialog, selectedTrack } = useContext(TrackListContext);
    return (
        <>
            <button onClick={() => {openDialog(dialogRef)}} className="size-7 flex items-center justify-center group cursor-pointer hover:scale-120 transition-transform">
                <svg width="368" height="368" viewBox="0 0 368 368" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="stroke-(--color-text) group-hover:stroke-(--color-bright)" d="M181 102L181 266" strokeWidth="45" strokeLinecap="round"/>
                    <path className="stroke-(--color-text) group-hover:stroke-(--color-bright)" d="M263 184L99 184" stroke="black" strokeWidth="45" strokeLinecap="round"/>
                    <circle className="stroke-(--color-text) group-hover:stroke-(--color-bright)" cx="184" cy="184" r="164.5" stroke="black" strokeWidth="45"/>
                </svg>
            </button>
            <AddToPlaylistDialog dialogRef={dialogRef} track={selectedTrack}/>
        </>
       
        
    )
}