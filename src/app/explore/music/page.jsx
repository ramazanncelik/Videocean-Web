"use client"
import CustomLoading from "@/components/CustomLoading";
import VideoCard from "@/components/VideoCard";
import { useAppContext } from "@/contexts/AppContext";
import { serverUrl } from "@/utils/utils";
import { useEffect, useState } from "react";

const Music = () => {

    const { isDarkMode, language, authToken } = useAppContext();
    const [musicVideos, setMusicVideos] = useState(null);
    const [loading, setLoading] = useState(false);

    const getMusicVideos = async () => {
        await setLoading(true);

        const url = serverUrl + `video/getAllVideos/Music`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const videos = await result.json();
            if (videos) {
                await setMusicVideos(videos);
            } else {
                await setMusicVideos([]);
            }
        }

        await setLoading(false);
    }

    useEffect(() => {
        getMusicVideos();
    }, []);

    if (!loading && musicVideos) {
        return (
            <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <div className={`flex flex-col space-y-2 m-auto max-w-screen-xl h-full px-4`}>

                    <p className={`w-full border-b p-1 ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}>
                        {language.includes("tr") ? "Müzik" : "Music"}
                    </p>

                    {musicVideos.length !== 0 ?
                        <div className="w-full pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {musicVideos.map(video => {
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
                            {language.includes("tr") ? "Müzik videosu bulunamadı." : "No music video found."}
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

export default Music;