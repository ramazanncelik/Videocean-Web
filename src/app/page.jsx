"use client";
import { useEffect, useState } from 'react';
import CustomLoading from '@/components/CustomLoading';
import { useAppContext } from '@/contexts/AppContext'
import { serverUrl } from '@/utils/utils';
import VideoCard from '@/components/VideoCard'

const App = () => {

    const { user, isDarkMode, language, mySubscriptions } = useAppContext();
    const [allVideos, setAllVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const getSubscriptionsVideos = async () => {
        setLoading(true);
        const allVideos = [];

        for (let i = 0; i < mySubscriptions.length; i++) {
            const url = serverUrl + `video/${mySubscriptions[i]}/userVideos`;
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (result.ok) {
                const videos = await result.json();
                if (videos) {
                    allVideos.push(...videos);
                }
            }
        }

        setAllVideos(allVideos);
        setLoading(false);
    }

    const getAllVideos = async () => {
        setLoading(true);
        if (!user) {
            await fetchAllVideos(); // Kullanıcı giriş yapmadıysa direkt olarak videoları yükle
        } else {
            await getSubscriptionsVideos(); // Kullanıcı giriş yapmışsa abonelik videolarını al
            await fetchAllVideos(); // Daha sonra tüm videoları yükle
        }
        setLoading(false);
    }

    const fetchAllVideos = async () => {
        const url = serverUrl + `video/getAllVideos/all`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (result.ok) {
            const videos = await result.json();
            if (videos) {
                videos.sort((a, b) => b.ViewsCount - a.ViewsCount);
                setAllVideos(videos);
            }
        }
    }

    useEffect(() => {
        getAllVideos();

        return () => {
            setAllVideos([]);
        }
    }, [user]);

    if (!loading && allVideos) {
        return (
            <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <div className={`flex flex-col space-y-2 m-auto max-w-screen-xl h-full px-4`}>

                    {allVideos.length !== 0 ?
                        <div className="w-full pt-2 pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {allVideos.map(video => {
                                return (
                                    <VideoCard
                                        key={video._id}
                                        videoId={null}
                                        videoData={video} />
                                )
                            })}
                        </div>
                        :
                        <div className="w-full mt-2 p-3 rounded-lg bg-blue-100 text-blue-700">
                            {language.includes("tr") ? "Video bulunamadı." : "No video found."}
                        </div>}

                </div>
            </div>
        );
    } else {
        <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
            <CustomLoading
                type={"hash"}
                color={isDarkMode ? "white" : "black"}
                size={24}
                className={`flex items-center justify-center m-auto max-w-screen-xl h-full`}
            />
        </div>
    }
}

export default App;