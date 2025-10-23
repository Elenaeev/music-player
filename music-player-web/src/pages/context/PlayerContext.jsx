import axios from "axios";
import { createContext, useRef, useState, useEffect, useContext } from "react";
import { TrackListContext } from "./TrackListContext";

export const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    // const [selectedTrack, setSelectedTrack] = useState(null);
    // const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(100);
    const [oldVolume, setOldVolume] = useState(100);
    const [duration, setDuration] = useState(100);
    const [currentTime, setCurrentTime] = useState(0);
    const [repeatPref, setRepeatPref] = useState('none');

    const repeatPrefRef = useRef(repeatPref);

    const { selectedTrackIndex, setSelectedTrackIndex, selectedTrack, setSelectedTrack, selectedTrackList } = useContext(TrackListContext);

    const audioRef = useRef(null);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const getCSRFToken = () => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : null;
    };
    
    const handleVolumeChange = (e) => {
        setVolume(e.target.value)
        //audioRef.current.volume = (volume/100).toFixed(1);
        // console.log(audioRef.current.volume);
    }

    const HandleMuteUnmute = () => {
        if(oldVolume) {
            setVolume(oldVolume);
            setOldVolume(null);
        } else {
            setOldVolume(volume);
            setVolume(0);
        }
    }

    const handlePlay = () => {
        audioRef.current?.play();
        setIsPlaying(true);
    }

    const handlePause = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    }

    const handleSeek = (e) => {
        audioRef.current.currentTime = e.target.value;
        setCurrentTime(e.target.value);
        // if (!isSeeking) {
        //     audioRef.current.currentTime = e.target.value;
        // }
    }

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////////
    const handlePlayPrevious = () => {
        if (selectedTrackIndex > 0) {
            const newIndex = selectedTrackIndex - 1;
            setSelectedTrack(selectedTrackList[newIndex]);
            setSelectedTrackIndex(newIndex);
        }
    };

    const handlePlayNextTrack = () => {
        if (selectedTrackIndex + 1 < selectedTrackList.length) {
            const newIndex = selectedTrackIndex + 1;
            setSelectedTrack(selectedTrackList[newIndex]);
            setSelectedTrackIndex(newIndex);
        }
    };

    const handleRepeat = () => {
        if (selectedTrackList?.length > 0) {
            if(selectedTrackIndex !== 0) {
                setSelectedTrack(selectedTrackList[0]);
                setSelectedTrackIndex(0);
            } else {
                handleRepeatTrack();
            }
            
        }
    };

    const handleRepeatTrack = () => {
        if (audioRef.current) {
            setCurrentTime(0);
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleGotoStartOrPlayPrevious = () => {
        if (selectedTrackIndex > 0 && currentTime < 3) {
            handlePlayPrevious();
        } else {
            handleRepeatTrack();
        }
    };

    const handlePlayNext = () => {
        console.log(`Current index: ${selectedTrackIndex}, length: ${selectedTrackList.length}`);
        if (selectedTrackIndex + 1 < selectedTrackList.length) {
            handlePlayNextTrack();
        } else {
            handleRepeat();
        }
    };

    const handlePlayNextNoRepeat = () => {
        if (selectedTrackIndex + 1 < selectedTrackList.length) {
            handlePlayNextTrack();
        } else {
            setIsPlaying(false);
        }
    };

    // Automatically advance after a track ends
    const handlePlayNextAuto = () => {
        if (repeatPrefRef.current === "none") {
            handlePlayNextNoRepeat();
        } else if (repeatPrefRef.current === "list") {
            handlePlayNext();
        }
    };


    const handleTrackEnd = () => {
        console.log("Track ended!");
        console.log("Repeat preference:", repeatPrefRef.current);
        if (repeatPrefRef.current === "track") {
            handleRepeatTrack();
        } else {
            handlePlayNextAuto(); 
        }
    };


    const handleChangeRepeat = () => {
        if(repeatPref === 'none') {
          setRepeatPref('track') ;
        }
        else if(repeatPref === 'track') {
          setRepeatPref('list');
        }
        else if(repeatPref === "list") {
          setRepeatPref('none');
        }

    }

    useEffect(() => {
        console.log(repeatPref);
        repeatPrefRef.current = repeatPref;
    }, [repeatPref])

    /////////////////////////////////////////////////////////////////////////////////

    function formatDuration(durationSeconds) {
       const minutes = Math.floor(durationSeconds / 60);
       const seconds = Math.floor(durationSeconds % 60);
       const formattedSeconds = seconds.toString().padStart(2, "0");
       return  `${minutes}:${formattedSeconds}`;
    }

    const playerState = {
        selectedTrack, setSelectedTrack,
        audioRef,
        isPlaying, setIsPlaying,
        volume, setVolume, 
        duration, setDuration, 
        currentTime, setCurrentTime,
        selectedTrackIndex, setSelectedTrackIndex,
        formatDuration,
        handlePause, 
        handlePlay,
        handleSeek,
        handleTimeUpdate,
        handleVolumeChange,
        HandleMuteUnmute,
        handleChangeRepeat,
        handleGotoStartOrPlayPrevious, 
        repeatPref,
        handlePlayNext,
    }

    useEffect(() => {
        audioRef.current.volume = (volume/100).toFixed(2);
        // console.log(audioRef.current.volume);

    }, [volume])


    useEffect(() => {
      if (selectedTrack && audioRef.current) {
        const audio = audioRef.current;
        audio.src = `${BASE_URL}` + selectedTrack.audio_file;

        let played = false;

        const handleCanPlay = () => {
            if (!played) {
                audio.play();
                setIsPlaying(true);
                played = true;
            }
        };

        audio.addEventListener("canplaythrough", handleCanPlay);
        audio.addEventListener("timeupdate", handleTimeUpdate);      
        audio.addEventListener("ended", handleTrackEnd);
        audio.load();
      
        return () => {
            audio.removeEventListener("canplaythrough", handleCanPlay);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleTrackEnd);
        };
      }
    }, [selectedTrack]);

    return (
        <PlayerContext.Provider value={playerState}>
            { children }
        </PlayerContext.Provider>
    )
}