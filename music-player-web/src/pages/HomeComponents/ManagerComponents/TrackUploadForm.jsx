import { useState, useEffect, useContext } from "react";
import axios from "axios";
import DragAndDropInput from "./DragAndDropInput";
import { TrackListContext } from "../../context/TrackListContext";
import { PlaylistContext } from "../../context/PlaylistContext";

export default function TrackUploadForm({ setSelectedTab }) {
    const [title, setTitle] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [message, setMessage] = useState('');
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { handleUpdateDisplayedTrackList, getCSRFToken } = useContext(TrackListContext);
    const { selectedPlaylistId } = useContext(PlaylistContext);

    const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('title', title);
      formData.append('audio_file', audioFile);

      try {
        const response = await axios.post(
          `${BASE_URL}/api/upload_track/`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRFToken': getCSRFToken()
            },
          }
        );
        setMessage('Track uploaded successfully!');
        
      } catch (error) {
        setMessage('Upload failed');
        console.error(error);
      } finally {
        if(selectedPlaylistId == null) {
            handleUpdateDisplayedTrackList(null, true);
        } else {
            handleUpdateDisplayedTrackList(null, false);
        }
        
        setSelectedTab("All Tracks");
      }
    };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 h-full">

      <input
        type="text"
        name="title"
        placeholder="Track title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-10 bg-white border-2 border-transparent p-2 rounded-lg focus:border-(--color-bg-two) outline-none"
      />

      <DragAndDropInput audioFile={audioFile} setAudioFile={setAudioFile}/>

      {
        audioFile?
        (
          <button type="submit" className="bg-(--color-bright) text-white rounded-full h-10 cursor-pointer">Upload</button>
        ) :
        (
          <></>
        )
      }
    </form>
  );
    
}