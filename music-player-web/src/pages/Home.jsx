import { createContext, useState, useEffect, useContext } from "react";
import Player from "./HomeComponents/Player";
import Manager from "./HomeComponents/Manager";
import axios from "axios";
import Tabs from "./HomeComponents/Tabs";
import UserButton from "./HomeComponents/UserButton";
import { TrackListProvider } from "./context/TrackListContext";
import { PlayerProvider } from "./context/PlayerContext";
import { PlaylistProvider } from "./context/PlaylistContext";
import { LoadingContext, LoadingProvider } from "./context/LoadingContext";
import { useNavigate } from "react-router-dom";

export default function Home()
{
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [user, setUser] = useState(null);
    const { loading, setLoading } = useContext(LoadingContext);
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState("All Tracks");
    const [tabMenuOpened, setTabMenuOpened] = useState(false);
    const [playlistOpened, setPlaylistOpened] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${BASE_URL}/api/user/current_user/`, { withCredentials: true })
            .then(res => {
                setUser(res.data); 
            })
        .catch(() => {
            setUser(null); 
            navigate('/login');
        })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {setPlaylistOpened(true)},[selectedTab])
    useEffect(() => {setTabMenuOpened(false)},[playlistOpened])
    

    if (loading) return <div>Loading...</div>;

    return (
            user ? (
                <div className="box-border w-[100svw] h-[100svh] sm:p-[2%] flex flex-col">
                    <div className=" w-screen h-max min-h-0 lg:hidden items-center justify-between flex flex-row scale-90">
                        <div className="flex flex-row items-center gap-5">
                            <button onClick={()=>{setTabMenuOpened(!tabMenuOpened); console.log(tabMenuOpened)}} className="flex flex-row mb-2 ml-2 items-center"><i className="fa-solid fa-bars scale-150 text-(--color-bright)"></i></button>
                            <h3 className="text-2xl mb-3 w-max flex lg:hidden">Hi,&nbsp;<span className="text-(--color-bright) font-bold">{user.username}</span>!</h3>
                        </div>
                        
                        <UserButton/>
                    </div>
                    <div className="flex h-full ">
                        <PlaylistProvider>
                            <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} username={user.username} tabMenuOpened={tabMenuOpened} setTabMenuOpened={setTabMenuOpened}/>
                            <TrackListProvider>
                                <PlayerProvider>
                                    <div className="lg:w-2/5 sm:block h-full sm:w-4/10 hidden">
                                        <Manager setSelectedTab={setSelectedTab} selectedTab={selectedTab}/>
                                    </div>
                                    
                                    <div className="lg:w-2/5 bg-transparent flex flex-col sm:w-6/10 w-full h-full">
                                        <div className="hidden lg:block">
                                            <UserButton/>
                                        </div>
                                        
                                        <div className="flex items-center justify-center h-full w-full">
                                            <Player/>
                                        </div>
                                        <button onClick={()=>{setPlaylistOpened(!playlistOpened)}} className="h-15 w-full rounded-t-2xl z-100 bg-(--color-main) sm:hidden">
                                            {
                                                (playlistOpened)? 
                                                    (
                                                        <i className="fa-solid fa-chevron-down"></i>
                                                    ) :
                                                    (
                                                        <i className="fa-solid fa-chevron-up"></i>
                                                    )
                                            }
                                        </button>
                                    </div>

                                    <div className={"sm:hidden w-[100vw] h-150 absolute top-full  " + (playlistOpened? "-translate-y-160 transition-all" : "-translate-y-0 transition-all")}>
                                        <Manager setSelectedTab={setSelectedTab} selectedTab={selectedTab}/>
                                    </div>
                                    


                                </PlayerProvider>
                            </TrackListProvider>
                        </PlaylistProvider>
                        
                    </div>

                    
                </div>
                
            ) : (
                <div>Please log in</div>
            )
    );
}