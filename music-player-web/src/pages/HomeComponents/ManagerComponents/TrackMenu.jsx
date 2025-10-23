import { useContext, useEffect, useRef, useState } from "react";
import { TrackListContext } from "../../context/TrackListContext";
import AddToPlaylistDialog from "../PlayerComponents/AddToPlaylistDialog";
import DeleteDialog from "./DeleteDialog";

export default function TrackMenu({ track, isSamePlaylist, displayedPlaylist, menuOpened, setMenuOpened, menuRef }) {

    const settings = ['Edit', 'Add to Playlist', 'Delete'];
    const playlistDialogRef = useRef(null);
    const deleteDialogRef = useRef(null);
    const { openDialog } = useContext(TrackListContext);
    const [menuOption, setMenuOption] = useState(null);
    const [menuUsed, setMenuUsed] = useState(false);

    useEffect(() => {
        if (menuOption) {
            console.log(menuOption);
            if (menuOption == 'Add to Playlist') {
                openDialog(playlistDialogRef);
            } else if (menuOption == 'Delete') {
                openDialog(deleteDialogRef);
            }

            setMenuOpened(false);
            setMenuOption(null);
        }
    }, [menuOption])

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
            setMenuOpened(false);
            }
        }
        if (menuOpened) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpened]);

    return(
        <>
        
            {
                menuOpened ? 
                (

                    <div 
                    // onClick={(e)=>{e.stopPropagation()}}
                    // onMouseEnter={()=>setMenuUsed(true)}
                    // onMouseLeave={()=>{
                    //     setTimeout(() => {
                    //         setMenuUsed(false);
                    //     }, 100);
                    // }}
                    className=" h-max w-max bg-white rounded-md flex flex-col items-start font-normal p-2 gap-0.5">
                        {
                            settings.map((option, index) => {
                                return (
                                    <div key={index} className="w-full">
                                        <button onClick={(e)=>{e.stopPropagation(); setMenuOption(option);}} className="bg-white hover:bg-gray-100 w-full flex flex-col items-start rounded-sm p-1">
                                            <h1 className={(option == "Delete"? "text-red-500" : "")}>{option}</h1>
                                        </button>
                                        <hr className={"w-full border-gray-300 m-0"}/>
                                    </div>
                                )                                 
                            })
                        }                           
                    </div>
                ) : (<></>)
            }

            <AddToPlaylistDialog dialogRef={playlistDialogRef} track={track}/>
            <DeleteDialog dialogRef={deleteDialogRef} selectedPlaylistId={displayedPlaylist? displayedPlaylist.id : null} track={track} isSamePlaylist={isSamePlaylist}/>
        </>
        

    )
}