"use client"

import CustomLoading from "@/components/CustomLoading";
import { useAppContext } from "@/contexts/AppContext";
import { serverUrl } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Video = ({ videoData }) => {

    const { isDarkMode, language, authToken, user } = useAppContext();
    const [videoOwnerData, setVideoOwnerData] = useState(null)
    const [viewsCount, setViewsCount] = useState("");
    const [date, setDate] = useState("");

    const getUserData = async () => {
        const url = serverUrl + `user/${videoData.OwnerId}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const user = await result.json();
            await setVideoOwnerData({
                _id: user._id,
                NickName: user.NickName,
                ImageUrl: user.ImageUrl,
            });
        }
    }

    const editViewsCount = async () => {
        const viewsText = language.includes("tr") ? "görüntülenme" : "views";
        if (videoData.ViewsCount >= 1000000000) {
            // Milyarlar
            setViewsCount((videoData.ViewsCount / 1000000000).toFixed(0) + ' B ' + viewsText);
        } else if (videoData.ViewsCount >= 1000000) {
            // Milyonlar
            setViewsCount((videoData.ViewsCount / 1000000).toFixed(0) + ' M ' + viewsText);
        } else if (videoData.ViewsCount >= 1000) {
            // Binler
            setViewsCount((videoData.ViewsCount / 1000).toFixed(0) + ' K ' + viewsText);
        } else {
            if (videoData.ViewsCount.toString() === "0") {
                setViewsCount(language.includes("tr") ? "görüntülenme yok" : "no views");
            } else {
                setViewsCount(videoData.ViewsCount + (language.includes("tr") ? " görüntülenme" : " views"));
            }
        }
    }

    const editDate = () => {
        const postDate = new Date(videoData.Date);
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
        getUserData();
        editViewsCount();
        editDate();
    }, [videoData])

    if (videoOwnerData) {
        return (
            <Link href={`video/${videoData._id}`} className="w-full flex flex-row space-x-5">
                <Image
                    width={0}
                    height={0}
                    src={videoData.CoverPhotoUrl}
                    className='w-80 h-48 rounded-xl'
                    alt="videoImage"
                />

                <div className="flex flex-1 flex-col space-y-1">
                    <p className="font-semibold text-lg">
                        {videoData.Title}
                    </p>
                    <p className={`w-full text-xs ${isDarkMode ? "text-white" : "text-black"}`}>
                        {`${viewsCount} - ${date}`}
                    </p>

                    {videoOwnerData._id !== user._id &&
                        <Link href={`user/${videoOwnerData._id}`} className="w-full py-4 flex flex-row space-x-2">
                            <Image
                                width={0}
                                height={0}
                                src={videoOwnerData.ImageUrl}
                                className='w-6 h-6 rounded-full'
                                alt="userImage"
                            />

                            <span className="text-sm">{videoOwnerData.NickName}</span>
                        </Link>
                        ||
                        <div className="w-full py-4 flex flex-row space-x-2">
                            <Image
                                width={0}
                                height={0}
                                src={videoOwnerData.ImageUrl}
                                className='w-6 h-6 rounded-full'
                                alt="userImage"
                            />

                            <span className="text-sm">{videoOwnerData.NickName}</span>
                        </div>}

                    <p className="text-sm">{videoData.Description.length > 150 ?
                        (videoData.Description.slice(0, 150) + "...")
                        :
                        videoData.Description}</p>

                </div>
            </Link>
        );
    } else {
        <CustomLoading
            className={`w-full h-48 flex items-center justify-center`}
            color={isDarkMode ? "white" : "black"}
            size={"16"}
            type={"hash"}
        />
    }
}

export default Video;