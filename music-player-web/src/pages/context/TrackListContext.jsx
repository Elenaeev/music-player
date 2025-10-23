import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { PlaylistContext } from "./PlaylistContext";

export const TrackListContext = createContext();

export function TrackListProvider({ children }) {
    const [displayedTrackList, setDisplayedTrackList] = useState(null);
    const [selectedTrackList, setSelectedTrackList] = useState(null);
    const [deletedItemIndex, setDeletedItemIndex] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
    const [deletedTrackId, setDeletedTrackId] = useState(null);
    const [allTrackList, setAllTrackList] = useState(null);

    const { handleAddTrackToPlaylist, handleUpdatePlaylistsList } = useContext(PlaylistContext); 
    const [playlistUpdated, setPlaylistUpdated] = useState(false);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleDisplayAllTracks = () => {
        setDisplayedTrackList(allTrackList);
    }

    const handleUpdateDisplayedTrackList = async (playlist_id, isSamePlaylist) => {
        if(playlist_id == null) {
            await axios.get(`${BASE_URL}/api/user_tracks/`, { withCredentials: true })
                .then(res => {
                    setDisplayedTrackList(res.data);
                    setAllTrackList(res.data);
                    if(isSamePlaylist) {
                        console.log(isSamePlaylist);
                        setSelectedTrackList(res.data);
                    }
                })
                .catch(res => {
                    console.log(res);
                })
        } else {
            await axios.get(`${BASE_URL}/api/get_tracks_of_playlist/`, 
                { 
                    withCredentials: true,
                    params: {
                        playlist_id: playlist_id
                    }
                })
                .then(res => {
                    setDisplayedTrackList(res.data);
                    if(isSamePlaylist) {
                        setSelectedTrackList(res.data);
                    }
                    console.log(res);
                })
                .catch(res => {
                    console.log(res);
                })
        } 
    }

    const openDialog = (dialogRef) => {
        const dialog = dialogRef.current;

        if (dialog.open) {
            dialog.close(); 
        }

        dialog.showModal();
    };

    const closeDialog = (dialogRef) => {
        dialogRef.current?.close();
    }

    const getCSRFToken = () => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : null;
    };

    const handleDeleteTrack = async (track_id, playlist_id, isSamePlaylist) => {
        if(playlist_id == null){
            try {
                const response = await axios.post(`${BASE_URL}/api/delete_track/`, {"id" : track_id}, 
                {
                    withCredentials: true, 
                    headers: {
                        'X-CSRFToken': getCSRFToken()
                    }
                });

                await handleUpdateDisplayedTrackList(null, isSamePlaylist);
                await handleUpdatePlaylistsList();
            }
            catch(e) {
                console.log(e);
            }
            finally{
                //console.log(`deciding... ${selectedTrack.id} ${track_id} ${selectedTrackIndex}`);
                if(selectedTrack && selectedTrack.id === track_id)
                {
                    setDeletedTrackId(track_id);
                }
            }
        } else {
            try{
                const response = await axios.post(`${BASE_URL}/api/remove_track_from_playlist/`, {"track_id" : track_id, "playlist_id": playlist_id}, 
                {
                    withCredentials: true, 
                    headers: {
                        'X-CSRFToken': getCSRFToken()
                    }
                });

                await handleUpdateDisplayedTrackList(playlist_id, isSamePlaylist);
                await handleUpdatePlaylistsList();
            }
            catch(e) {
                console.log(e);
            }
            finally{
                if(selectedTrack && selectedTrack.id === track_id)
                {
                    setDeletedTrackId(track_id);
                }
            }
        }
        
    }

    const AddToPlaylistAndUpdate = async (track_Id, playlist_id) => {
        await handleAddTrackToPlaylist(track_Id, playlist_id);
        setPlaylistUpdated(true);
    }


    useEffect(() => {
        console.log("selectedTracklist is changed")
        console.log(selectedTrackList);

        if(selectedTrackList && deletedTrackId!=null) {
            const index = selectedTrackList.findIndex(track => track.id === deletedTrackId);

            if(index == -1) {
                console.log("TRACK IS DELETED????");
                console.log(selectedTrackList.length);
                console.log(selectedTrackIndex);

                if(selectedTrackIndex >= selectedTrackList.length) {
                    setSelectedTrack(selectedTrackList[selectedTrackList.length-1]);
                    setSelectedTrackIndex(selectedTrackList.length-1);
                } else {
                    setSelectedTrack(selectedTrackList[selectedTrackIndex]);
                }

                setDeletedTrackId(null);
            }
        }
        
    }, [selectedTrackList, deletedTrackId])

    useEffect(() => {
        console.log(`selectedTrackIndex ${selectedTrackIndex}`)
    }, [selectedTrackIndex])
    
    useEffect(() => {
        handleUpdateDisplayedTrackList();
        handleUpdatePlaylistsList();
        setPlaylistUpdated(false);
    }, [playlistUpdated])


    const states = {
        displayedTrackList, setDisplayedTrackList,
        selectedTrackList, setSelectedTrackList,
        handleUpdateDisplayedTrackList,
        openDialog, closeDialog,
        getCSRFToken,
        handleDeleteTrack,
        selectedTrack, setSelectedTrack,
        selectedTrackIndex, setSelectedTrackIndex,
        AddToPlaylistAndUpdate,
        allTrackList,
        handleDisplayAllTracks
    }


    return (
        <TrackListContext.Provider value={states}>
            { children }
        </TrackListContext.Provider>
    )

}