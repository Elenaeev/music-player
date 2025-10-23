import { useContext, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { PlaylistContext } from "../context/PlaylistContext";

export default function Tabs(props) {
    const { selectedTab, setSelectedTab, username, tabMenuOpened, setTabMenuOpened } = props
    const { setDisplayedPlaylist } = useContext(PlaylistContext);
    const Tabs = ['All Tracks', 'Playlists', 'Add Track'];
    
    return (
        <>
        <div className={
            "rounded-md gap-1 " +
            "lg:hidden" +
            "shadow absolute w-4/15 pr-0 bg-[var(--color-main)] z-100 " +
            (tabMenuOpened 
                ? "flex flex-col opacity-100 transition-all" 
                : "invisible opacity-0 transition-all"
            )
        }>
            <h3 className="text-2xl mb-3 hidden lg:block">Hi, <span className="text-(--color-bright) font-bold">{username}</span>!</h3>
            {/* <button className=""><i class="fa-solid fa-bars scale-150 text-(--color-bright) mb-3"></i></button> */}
            {
                Tabs.map((tab, tabIndex) => {
                    return (
                        <button onClick={() => {setSelectedTab(tab); setDisplayedPlaylist(null); setTabMenuOpened(false);}} key={tabIndex} className={"cursor-pointer min-h-9 hover:bg-(--color-main) rounded-lg " + ((selectedTab == tab) ? "bg-white text-(--color-bright) font-bold" : "bg-transparent")}>{tab}</button>
                    )
                })
            }
        </div>  

        <div className={
            "rounded-md gap-1 " +
            "lg:w-1/5 lg:pr-2 lg:relative lg:bg-transparent lg:flex lg:flex-col lg:visible hidden" 

        }>
            <h3 className="text-2xl mb-3 hidden lg:block">Hi, <span className="text-(--color-bright) font-bold">{username}</span>!</h3>
            {/* <button className=""><i class="fa-solid fa-bars scale-150 text-(--color-bright) mb-3"></i></button> */}
            {
                Tabs.map((tab, tabIndex) => {
                    return (
                        <button onClick={() => {setSelectedTab(tab); setDisplayedPlaylist(null); setTabMenuOpened(false);}} key={tabIndex} className={"cursor-pointer min-h-9 hover:bg-(--color-main) rounded-lg " + ((selectedTab == tab) ? "bg-white text-(--color-bright) font-bold" : "bg-transparent")}>{tab}</button>
                    )
                })
            }
        </div>  
        </>
        
    )
}