"use client"
import CustomLoading from "@/components/CustomLoading";
import { useAppContext } from "@/contexts/AppContext";
import { serverUrl } from "@/utils/utils";
import { useEffect, useState } from "react";
import VideoOwner from '@/components/VideoPageComponents/VideoOwner'
import Actions from '@/components/VideoPageComponents/Actions'
import Description from '@/components/VideoPageComponents/Description'
import NewCommentForm from '@/components/VideoPageComponents/NewCommentForm'
import Comments from '@/components/VideoPageComponents/Comments'

const VideoPage = ({ params }) => {

    const { language, authToken, isDarkMode } = useAppContext();
    const [videoInfo, setVideoInfo] = useState(null);
    const [comments, setComments] = useState([]);

    const getVideoInfo = async () => {
        const url = serverUrl + `video/${params.id}`
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
        } else {
            await setVideoInfo(null);
        }
    }

    const updateViewsCount = async () => {
        const url = serverUrl + `video/${videoInfo._id}`;
        const body = {
            ViewsCount: videoInfo.ViewsCount + 1
        };
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(body)
        });
    }

    const getComments = async () => {
        const url = serverUrl + `comment/videoComments/${videoInfo._id}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const comments = await result.json();
            if (comments) {
                await setComments(comments);
            } else {
                await setComments([]);
            }
        } else {
            await setComments([]);
        }
    }

    useEffect(() => {
        if (videoInfo) {
            updateViewsCount();
            getComments();
        }
    }, [videoInfo]);

    useEffect(() => {
        if (params.id) {
            getVideoInfo();
        }
    }, [params, authToken]);

    if (videoInfo) {
        return (
            <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <div className={`flex flex-col w-full h-full space-y-2`}>

                    <video
                        className="w-full h-[70%]"
                        controls>
                        <source src={videoInfo.VideoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <div className="w-full h-max flex flex-col space-y-2 px-4 pb-4">
                        <p className="w-full font-semibold text-xl">
                            {videoInfo.Title}
                        </p>

                        <div className="flex flex-row space-x-2">
                            <VideoOwner videoOwnerId={videoInfo.OwnerId} />
                            {authToken &&
                                <Actions videoId={videoInfo._id} getVideoInfo={getVideoInfo} videoInfo={videoInfo} comments={comments} />}
                        </div>

                        <Description videoInfo={videoInfo} />
                        {authToken &&
                            <NewCommentForm videoId={videoInfo._id} getComments={getComments} />
                            ||
                            <div className="w-full p-3 bg-blue-100 text-blue-700 rounded-lg">
                                {language.includes("tr") ? "Yorum yapmak için lütfen giriş yapınız." : "Please log in to post a comment."}
                            </div>}
                        <Comments comments={comments} getComments={getComments} videoOwnerId={videoInfo.OwnerId} />
                    </div>

                </div>
            </div>
        );
    } else {
        return (
            <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <CustomLoading
                    type={"hash"}
                    color={isDarkMode ? "white" : "black"}
                    size={24}
                    className={`flex items-center justify-center m-auto max-w-screen-xl h-full`}
                />
            </div>
        );
    }
}

export default VideoPage;