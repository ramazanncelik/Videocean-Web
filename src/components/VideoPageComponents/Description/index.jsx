"use client";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect, useState } from "react";

const Description = ({ videoInfo }) => {

    const { isDarkMode, language } = useAppContext();
    const [viewsCount, setViewsCount] = useState("");
    const [date, setDate] = useState("");
    const [descriptionVisible, setDescriptionVisible] = useState(false)

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
                setViewsCount(videoInfo.ViewsCount.toString() + " " + viewsText);
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
        editViewsCount();
        editDate();
    }, [videoInfo]);

    return (
        <div className={`p-3 rounded-lg flex flex-col space-y-1 ${isDarkMode ? "bg-slate-600" : "bg-gray-100"}`}>
            <p className="flex flex-row space-x-3 text-sm font-semibold">
                <span>{viewsCount}</span>
                <span> - </span>
                <span>{date}</span>
            </p>

            <p>
                {videoInfo.Description.length > 150 &&
                    <p className="w-full">
                        {descriptionVisible ?
                            videoInfo.Description
                            :
                            <>
                                {videoInfo.Description.slice(0, 150)}
                                <span className="cursor-pointer font-semibold" onClick={() => setDescriptionVisible(true)}>
                                    {language.includes("tr") ? " ...devamı" : " ...read more"}
                                </span></>}

                    </p>
                    ||
                    videoInfo.Description}
            </p>
        </div>
    );
}

export default Description;