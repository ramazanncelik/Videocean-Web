"use client"
import CustomLoading from "@/components/CustomLoading";
import VideoCard from "@/components/VideoCard";
import { useAppContext } from "@/contexts/AppContext";
import { serverUrl } from "@/utils/utils";
import { useEffect, useState } from "react";

const Sport = () => {

    const { isDarkMode, language, authToken } = useAppContext();
    const [sportVideos, setSportVideos] = useState(null);
    const [loading, setLoading] = useState(false);

    const getSportVideos = async () => {
        await setLoading(true);

        const url = serverUrl + `video/getAllVideos/Sports`;
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
                await setSportVideos(videos);
            } else {
                await setSportVideos([]);
            }
        }

        await setLoading(false);
    }

    useEffect(() => {
        getSportVideos();
    }, []);

    if (!loading && sportVideos) {
        return (
            <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <div className={`flex flex-col space-y-2 m-auto max-w-screen-xl h-full px-4`}>

                    <p className={`w-full border-b p-1 ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}>
                        {language.includes("tr") ? "Spor" : "Sport"}
                    </p>

                    {sportVideos.length !== 0 ?
                        <div className="w-full pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {sportVideos.map(video => {
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
                            {language.includes("tr") ? "Spor videosu bulunamadı." : "No sport video found."}
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

export default Sport;