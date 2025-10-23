import { useState } from "react";

export default function DragAndDropInput(props) {

    const { audioFile, setAudioFile } = props
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("audio/")) {
                setAudioFile(file);
            }
           
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
            if (file) {
            setAudioFile(file);
        }

    };

    return (
        <>
            <label
                htmlFor="file-upload"
                className={"cursor-pointer text-center flex items-center justify-center text-gray-400 border-3 border-(--color-bg-two) border-dashed px-4 py-2 rounded-lg min-h-30 h-full " + ((isDragging)?" bg-gray-100" : "bg-white")}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    id="file-upload"
                    type="file"
                    name="audio_file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="bg-black rounded-lg hidden"
                />
                {
                    audioFile?
                    (
                        <div className="flex flex-col m-3">
                            <img src="00_file.svg" alt="track" className="h-20"/>
                            <p>{audioFile.name}</p>
                        </div>
                    )
                    :
                    (
                        <div>
                            <i className="fa-solid fa-upload text-3xl"></i>
                            <p>Click to upload or drag and drop your file here</p>
                        </div>
                        
                    )
                }
                


            </label>
            
        </>
    )
}