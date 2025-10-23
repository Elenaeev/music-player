import { useContext, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerContext } from "../../context/PlayerContext";

export default function VolumeControl() {
    const { handleVolumeChange, HandleMuteUnmute, volume } = useContext(PlayerContext);
    const [volumeSettingVisible, setVolumeSettingVisible] = useState(false);
    const [volumeSettingOpen, setVolumeSettingOpen] = useState(false);
    const [volumeChanging, setVolumeChanging] = useState(false);

    return (
        <div>
            <AnimatePresence>
            {(volumeSettingVisible || volumeSettingOpen) && (
                <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute h-max w-max p-5 -rotate-90 rounded-xl flex items-center bg-(--color-bg-one) justify-center -translate-y-35 -translate-15"
                onMouseOver={() => setVolumeSettingOpen(true)}
                onMouseLeave={() => setVolumeSettingOpen(false)}
                >
                    <div className="relative">
                        <input 
                            type="range" 
                            className="relative w-30 z-10 opacity-0"
                            value={volume}
                            max={100.1}
                            min={-0.1}
                            onMouseDown={()=>setVolumeChanging(true)}
                            onMouseUp={()=>setVolumeChanging(false)}
                            onChange={handleVolumeChange}
                        />
                        <div className="bg-white w-30 h-2 absolute bottom-2.25 rounded-full">
                            <div className="h-full rounded-full flex flex-row items-center justify-end bg-(--color-bright)" style={{ width: `${volume}%` }}>
                                <div className={"bg-(--color-bright) transition-all rounded-full " + (volumeChanging? "size-4" : "size-2")}>

                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            <button 
                onMouseOver={()=>{setVolumeSettingVisible(true)}} 
                onMouseLeave={()=>{ 
                    setTimeout(() => {
                        setVolumeSettingVisible(false);
                    }, 200); }}
                onClick={HandleMuteUnmute} 
                className="h-fit w-fit hover:scale-120 transition-transform"
            >
                {
                    (volume >= 50) ?
                    (<i className="fa-solid fa-volume-high text-3xl text-(--color-text) hover:text-(--color-bright) cursor-pointer"></i>)
                    : ((volume > 0) ? (<i className="fa-solid fa-volume-low text-3xl text-(--color-text) hover:text-(--color-bright) cursor-pointer"></i>) : (<i className="fa-solid fa-volume-xmark text-3xl text-(--color-text) hover:text-(--color-bright) cursor-pointer"></i>)
                    )
                }

            </button>
        </div>
    )
}