"use client"
import { useState, useEffect } from 'react'
import { useAppContext } from '@/contexts/AppContext';
import Image from 'next/image';
import { serverUrl } from '@/utils/utils';
import CustomLoading from '../CustomLoading';
import Link from 'next/link';

const VideoCard = ({ videoId, videoData }) => {

    const { user, authToken, language, isDarkMode } = useAppContext();
    const [videoInfo, setVideoInfo] = useState(null);
    const [videoOwnerInfo, setVideoOwnerInfo] = useState(null);
    const [viewsCount, setViewsCount] = useState("");
    const [date, setDate] = useState("");

    const getVideoInfo = async () => {
        const url = serverUrl + `video/${videoId}`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const video = await result.json();
            if (video) {
                await setVideoInfo(video);
            } else {
                await setVideoInfo(null);
            }
        }
    }

    const getVideoOwnerInfo = async () => {
        const url = serverUrl + `user/${videoInfo.OwnerId}`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const user = await result.json();
            await setVideoOwnerInfo(user);
        }
    }

    const editViewsCount = async () => {
        const viewsText = language.includes("tr") ? "görüntülenme" : "views";
        if (videoInfo.ViewsCount >= 1000000000) {
            // Milyarlar
            setViewsCount((videoInfo.ViewsCount / 1000000000).toFixed(0) + ' B ' + viewsText);
        } else if (videoInfo.ViewsCount >= 1000000) {
            // Milyonlar
            setViewsCount((videoInfo.ViewsCount / 1000000).toFixed(0) + ' M ' + viewsText);
        } else if (videoInfo.ViewsCount >= 1000) {
            // Binler
            setViewsCount((videoInfo.ViewsCount / 1000).toFixed(0) + ' K ' + viewsText);
        } else {
            if (videoInfo.ViewsCount.toString() === "0") {
                setViewsCount(language.includes("tr") ? "görüntülenme yok" : "no views");
            } else {
                setViewsCount(videoInfo.ViewsCount + (language.includes("tr") ? " görüntülenme" : " views"));
            }
        }
    }

    const editDate = () => {
        const postDate = new Date(videoInfo.Date);
        const currentDate = new Date();

        const timeDiff = Math.abs(currentDate - postDate);

        const yearsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
        const monthsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        const secondsDiff = Math.floor(timeDiff / 1000);

        if (yearsDiff > 0) {
            setDate(`${yearsDiff} ${language.includes("tr") ? "yıl önce" : "years ago"}`);
        } else if (monthsDiff > 0) {
            setDate(`${monthsDiff} ${language.includes("tr") ? "ay önce" : "months ago"}`);
        } else if (daysDiff > 0) {
            setDate(`${daysDiff} ${language.includes("tr") ? "gün önce" : "days ago"}`);
        } else if (hoursDiff > 0) {
            setDate(`${hoursDiff} ${language.includes("tr") ? "saat önce" : "hours ago"}`);
        } else if (minutesDiff > 0) {
            setDate(`${minutesDiff} ${language.includes("tr") ? "dakika önce" : "minutes ago"}`);
        } else {
            setDate(`${secondsDiff} ${language.includes("tr") ? "saniye önce" : "seconds ago"}`);
        }
    };

    useEffect(() => {
        if (videoData) {
            setVideoInfo(videoData);
        }
    }, [videoData]);

    useEffect(() => {
        if (videoInfo) {
            getVideoOwnerInfo();
            editViewsCount();
            editDate();
        }
    }, [videoInfo]);

    useEffect(() => {
        if (videoId) {
            getVideoInfo();
        }
    }, [videoId]);

    if (videoOwnerInfo) {
        return (
            <Link href={`/video/${videoInfo._id}`} className="flex flex-1 flex-col space-y-2">
                <Image
                    width={0}
                    height={0}
                    src={videoInfo.CoverPhotoUrl}
                    alt={videoInfo._id}
                    className='w-full h-56 md:h-48 rounded-lg select-none'
                />
                <div className='w-full flex flex-row space-x-3'>
                    {videoInfo.OwnerId !== user._id &&
                        <Link href={`/user/${videoOwnerInfo._id}`}>
                            <Image
                                width={0}
                                height={0}
                                src={videoOwnerInfo.ImageUrl}
                                alt={videoOwnerInfo.NickName}
                                className='w-9 h-9 rounded-full select-none'
                            />
                        </Link>
                        ||
                        <Image
                            width={0}
                            height={0}
                            src={videoOwnerInfo.ImageUrl}
                            alt={videoOwnerInfo.NickName}
                            className='w-9 h-9 rounded-full select-none'
                        />}

                    <div className='flex flex-col'>
                        <p className={`flex-1 font-semibold text-base ${isDarkMode ? "text-white" : "text-black"}`}>
                            {videoInfo.Title}
                        </p>
                        {videoInfo.OwnerId !== user._id &&
                            <Link href={`/user/${videoOwnerInfo._id}`} className={`flex-1 text-sm ${isDarkMode ? "text-white" : "text-black"} hover:font-bold`}>
                                {videoOwnerInfo.NickName}
                            </Link>
                            ||
                            <p className={`flex-1 text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
                                {videoOwnerInfo.NickName}
                            </p>}
                        <p className={`flex-1 flex flex-col md:flex-row md:space-x-2 text-xs ${isDarkMode ? "text-white" : "text-black"}`}>
                            <span>
                                {viewsCount}
                            </span>
                            <span className='hidden md:block'>-</span>
                            <span className='w-full md:w-max'>
                                {date}
                            </span>
                        </p>
                    </div>
                </div>
            </Link>
        );
    } else {
        return (
            <CustomLoading
                className={`w-full h-56 md:h-48 flex items-center justify-center rounded-lg m-[1%] border ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}
                type={"hash"}
                size={24}
                color={isDarkMode ? "white" : "black"}
            />
        )
    }
}

export default VideoCard;