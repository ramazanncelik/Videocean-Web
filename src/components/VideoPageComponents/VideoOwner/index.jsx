"use client"

import CustomLoading from "@/components/CustomLoading";
import { useAppContext } from "@/contexts/AppContext";
import { serverUrl } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const VideoOwner = ({ videoOwnerId }) => {

    const { user, authToken, language, isDarkMode, getCurrentUserSubscriptions } = useAppContext();
    const [videoOwner, setVideoOwner] = useState(null);
    const [subscriberCount, setSubscriberCount] = useState("")
    const [subscriptionId, setSubscriptionId] = useState(null);
    const [loading, setLoading] = useState(false)

    const getVideoOwner = async () => {
        const url = serverUrl + `user/${videoOwnerId}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });

        if (result) {
            const videoOwner = await result.json();
            if (videoOwner) {
                await setVideoOwner({
                    _id: videoOwner._id,
                    Email: videoOwner.Email,
                    NickName: videoOwner.NickName,
                    FullName: videoOwner.FullName,
                    ImageUrl: videoOwner.ImageUrl,
                    Biography: videoOwner.Biography,
                    SubscriberCount: videoOwner.SubscriberCount,
                });
            }
        }
    }

    const editSubscriberCount = async () => {
        const subscriberText = language.includes("tr") ? "abone" : "subscriber";
        if (videoOwner.SubscriberCount >= 1000000000) {
            // Milyarlar
            setSubscriberCount((videoOwner.SubscriberCount / 1000000000).toFixed(0) + ' B ' + subscriberText);
        } else if (videoOwner.SubscriberCount >= 1000000) {
            // Milyonlar
            setSubscriberCount((videoOwner.SubscriberCount / 1000000).toFixed(0) + ' M ' + subscriberText);
        } else if (videoOwner.SubscriberCount >= 1000) {
            // Binler
            setSubscriberCount((videoOwner.SubscriberCount / 1000).toFixed(0) + ' K ' + subscriberText);
        } else {
            setSubscriberCount(videoOwner.SubscriberCount.toString() + " " + subscriberText);
        }
    }

    const subscriptionCheck = async () => {
        const url = serverUrl + `subscription/subscriptionCheck/${user._id}/${videoOwner._id}`;
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
        await getVideoOwner();
        await getCurrentUserSubscriptions(user._id);
        await setLoading(false);
    }

    const createSubscription = async () => {
        const url = serverUrl + `subscription`;
        const body = {
            From: user._id,
            To: videoOwner._id
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
        if (videoOwner && user) {
            editSubscriberCount();
            subscriptionCheck();
        }
    }, [videoOwner, user]);

    useEffect(() => {
        if (videoOwnerId) {
            getVideoOwner();
        }
    }, [videoOwnerId]);

    if (videoOwner) {
        return (
            <div className="w-max flex flex-row mt-2 space-x-2 items-center">
                <Link href={`/user/${videoOwner._id}`} className="w-max flex flex-row space-x-2 items-center">
                    <Image
                        width={0}
                        height={0}
                        src={videoOwner.ImageUrl}
                        className='w-12 h-12 select-none rounded-full'
                        alt="userImage"
                    />
                    <div className="flex flex-col">
                        <p className="font-semibold">
                            {videoOwner.NickName}
                        </p>
                        <p className="text-sm">
                            {subscriberCount}
                        </p>
                    </div>
                </Link>

                {user &&
                    (videoOwner._id !== user._id &&
                        <div className='w-max h-max select-none'>
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
        );
    }
}

export default VideoOwner;