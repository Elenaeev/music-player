import { useContext, useEffect } from "react"
import { TrackListContext } from "../../context/TrackListContext"
import TrackCard from "./TrackCard";
import { PlaylistContext } from "../../context/PlaylistContext";

export default function TrackList({ displayedPlaylist }) {
    const { displayedTrackList } = useContext(TrackListContext);
    const { setDisplayedPlaylist } = useContext(PlaylistContext);

    return (
    displayedTrackList ? (
        <>
        {displayedPlaylist ? (
            <div className="flex flex-row items-center">
                <button 
                    onClick={() => {setDisplayedPlaylist(null)}}
                    className="size-10 cursor-pointer"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold text-xl text-(--color-bright)">{displayedPlaylist.name}</h1>
            </div>
        ) : (
            <></>
        )}

        <div className="flex flex-col gap-1">
            {displayedTrackList.map((track, trackIndex) => (
                <TrackCard track={track} key={trackIndex} trackIndex={trackIndex} />
            ))}
        </div>
        
        </>
    ) : (
        <></>
    )
    );
}