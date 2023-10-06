"use client"
import CustomLoading from "@/components/CustomLoading";
import VideoCard from "@/components/VideoCard";
import { useAppContext } from "@/contexts/AppContext";
import { serverUrl } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

const UserPage = ({ params }) => {

    const { user, authToken, isDarkMode, language, getCurrentUserSubscriptions } = useAppContext();
    const [userInfo, setUserInfo] = useState(null);
    const [userVideos, setUserVideos] = useState(null);
    const [subscriptionId, setSubscriptionId] = useState(null);
    const [loading, setLoading] = useState(false)

    const getUserInfo = async () => {
        const url = serverUrl + `user/${params.id}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const user = await result.json();
            await setUserInfo({
                _id: user._id,
                NickName: user.NickName,
                FullName: user.FullName,
                ImageUrl: user.ImageUrl,
                Biography: user.Biography,
                SubscriberCount: user.SubscriberCount,
                VideoCount: user.VideoCount,
            });
        }
    }

    const getUserVideos = async () => {
        const url = serverUrl + `video/${userInfo._id}/userVideos`
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
                await setUserVideos(videos);
            } else {
                await setUserVideos([]);
            }
        } else {
            await setUserVideos([]);
        }
    }

    const subscriptionCheck = async () => {
        const url = serverUrl + `subscription/subscriptionCheck/${user._id}/${userInfo._id}`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const subscriptionResult = await result.json();
            if (subscriptionResult.success) {
                setSubscriptionId(subscriptionResult.subscription_id)
            } else {
                setSubscriptionId(null);
            }
        }
    }

    const handleSubmitSubscribe = async () => {
        await setLoading(true);
        if (subscriptionId) {
            await deleteSubscription();
        } else {
            await createSubscription();
        }
        await getUserInfo();
        await getCurrentUserSubscriptions(user._id);
        await setLoading(false);
    }

    const createSubscription = async () => {
        const url = serverUrl + `subscription`;
        const body = {
            From: user._id,
            To: userInfo._id
        };
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(body)
        });
    }

    const deleteSubscription = async () => {
        const url = serverUrl + `subscription/${subscriptionId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
    }

    useEffect(() => {

        if (userInfo) {
            getUserVideos();
            if (user) {
                subscriptionCheck();
            }
        }

    }, [userInfo, user]);

    useEffect(() => {

        if (params.id) {
            getUserInfo();
        }

    }, [params]);

    if (userInfo && userVideos) {
        return (
            <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <div className={`flex flex-col space-y-2 m-auto max-w-screen-xl h-full px-4 pt-4`}>

                    <div className='w-full flex flex-row pt-4 select-none'>
                        <div className={`flex flex-1 flex-row space-x-3 items-center`}>
                            <Image
                                width={0}
                                height={0}
                                src={userInfo.ImageUrl}
                                className='w-32 h-32 rounded-full'
                                alt="userImage"
                            />
                            <div className={`flex flex-1 flex-col h-full items-start justify-start text-sm`}>
                                <p className='font-bold text-lg'>{userInfo.NickName}</p>
                                {userInfo.FullName &&
                                    <p>{userInfo.FullName}</p>}
                                <p>{language.includes("tr") ? "Abone - " : "Subscriber - "}{userInfo.SubscriberCount}</p>
                                <p>Video - {userInfo.VideoCount}</p>
                                {userInfo.Biography &&
                                    <p>{userInfo.Biography}</p>}
                            </div>
                        </div>

                        {user &&
                            (userInfo._id !== user._id &&
                                <div className='flex flex-col space-y-3'>
                                    {!loading ?
                                        <button onClick={() => handleSubmitSubscribe()} className={`h-max px-3 py-1 rounded-lg font-semibold ${isDarkMode ? "text-white bg-slate-600 hover:bg-slate-500" : "text-black bg-gray-100 hover:bg-gray-200"}`}>
                                            {!subscriptionId &&
                                                language.includes("tr") ? "Abone Ol" : "Subscribe"
                                                    ||
                                                    language.includes("tr") ? "Abonelikten Çık" : "Unsubscribe"}
                                        </button>
                                        :
                                        <CustomLoading
                                            type={"pacman"}
                                            color={isDarkMode ? "white" : "black"}
                                            size={8}
                                            className={`h-max px-12 py-2 rounded-lg ${isDarkMode ? "bg-slate-600" : "bg-gray-100"}`} />}
                                </div>)}
                    </div>

                    <p className={`w-full font-bold border-b p-1 ${isDarkMode ? "text-white border-slate-400" : "text-black border-gray-300"}`}>
                        {language.includes("tr") ?
                            "Videolar" : "Videos"}
                    </p>

                    {userVideos.length !== 0 ?
                        <div className="w-full pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {userVideos.map(video => {
                                return (
                                    <VideoCard
                                        key={video._id}
                                        videoId={null}
                                        videoData={video} />
                                )
                            })}
                        </div>
                        :
                        <div className="w-full p-3 bg-blue-100 text-blue-700 font-bold rounded-lg">
                            {language.includes("tr") ? `Kullanıcın paylaştığı video bulunamamaktadır.` : `The video shared by the user cannot be found.`}
                        </div>}
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

export default UserPage;