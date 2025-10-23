import { useContext, useEffect, useState, useRef } from "react"
import { TrackListContext } from "../context/TrackListContext"
import TrackList from "./ManagerComponents/TrackList";
import PlaylistsList from "./ManagerComponents/PlaylistList";
import { PlayerContext } from "../context/PlayerContext";
import { PlaylistContext } from "../context/PlaylistContext";
import TrackUploadForm from "./ManagerComponents/TrackUploadForm";
import { LoadingContext } from "../context/LoadingContext";

export default function Manager({ selectedTab, setSelectedTab }) {

    const {displayedTrackList, SelectedTrackList, handleUpdateDisplayedTrackList, allTrackList, handleDisplayAllTracks} = useContext(TrackListContext);

    const { displayedPlaylist, setSelectedPlaylist } = useContext(PlaylistContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("here loading");
        async function getData() {
            if(displayedPlaylist) {
                setLoading(true);
                await handleUpdateDisplayedTrackList(displayedPlaylist.id);
            } else if(selectedTab=="All Tracks") {
                if(allTrackList!=null) {
                    handleDisplayAllTracks();
                } else {
                    console.log(allTrackList);
                    setLoading(true);
                    await handleUpdateDisplayedTrackList(null);
                }

            }
        }

        getData();
    }, [displayedPlaylist])

    useEffect(() => {
        console.log("here unloading");
    }, [displayedPlaylist])

    useEffect(() => {
        setLoading(false);
    }, [displayedTrackList])


    return (
        <div 
            className="w-full h-full min-w-0 bg-(--color-main) rounded-t-2xl sm:rounded-2xl p-5 overflow-scroll overflow-x-hidden"
            onDragOver={() => {setSelectedTab('Add Track')}}
        >
            {
                (loading)?
                (<h1>Loading....</h1>):
                (
                    (selectedTab=="Playlists" ) ?
                    (
                        (displayedPlaylist == null)?
                        (
                            <PlaylistsList/>
                        ) : 
                        (
                            <TrackList displayedPlaylist={displayedPlaylist}/>
                        )
                    ) :
                    (
                        (selectedTab=="All Tracks")?
                        (
                            displayedTrackList?
                            (
                                <TrackList />

                            ) : (<></>)
                        ):
                        (
                            (selectedTab == "Add Track")?
                            (
                                <TrackUploadForm setSelectedTab={setSelectedTab}/>
                            ) : (<></>)

                        )
                    )
                )
            }


        </div>
    )
}