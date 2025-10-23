import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
    const [displayedPlaylist, setDisplayedPlaylist] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

    const getCSRFToken = () => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : null;
    };

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    const handleUpdatePlaylistsList = async () => {
        await axios.get(`${BASE_URL}/api/get_playlists/`, { withCredentials: true })
            .then(res => {
                setPlaylists(res.data);
                console.log(res);
            })
            .catch(res => {
                console.log(res);
            })
    }

    const handleAddTrackToPlaylist = async (track_id, playlist_id) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/add_track_to_playlist/`, {"playlist_id":playlist_id, "track_id": track_id}, 
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken' : getCSRFToken()
                    }
                }
            )
            
        } catch (e) {
            console.log(e);
        } finally {
            handleUpdatePlaylistsList();
        }
    }

    const handleCreateNewPlaylist = async (newPlaylistName) => {
        await axios.post(`${BASE_URL}/api/create_playlist/`, {"name":newPlaylistName}, 
            {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
            })
            .then(res => {
                handleUpdatePlaylistsList();
            })
            .catch(res =>{
                console.log(res);
            })
    }

    const handleDeletePlaylist = async (playlist_id) => {
        try{
            const response = await axios.post(`${BASE_URL}/api/delete_playlist/`, {"playlist_id" : playlist_id}, 
                {
                    withCredentials: true, 
                    headers: {
                        'X-CSRFToken': getCSRFToken()
                    }
                });

                await handleUpdatePlaylistsList();

        }
        catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        console.log(displayedPlaylist);
    }, [displayedPlaylist])

    useEffect(() => {
        handleUpdatePlaylistsList();
    }, [])

    const states = {
        displayedPlaylist, setDisplayedPlaylist, 
        playlists, setPlaylists,
        handleUpdatePlaylistsList,
        selectedPlaylistId, setSelectedPlaylistId,
        handleAddTrackToPlaylist,
        handleCreateNewPlaylist,
        handleDeletePlaylist,
    }

    return (
        <PlaylistContext.Provider value={states}>
            { children }
        </PlaylistContext.Provider>
    )

}