"use client";
import { useAppContext } from '@/contexts/AppContext'
import store from '@/store';
import { openModal } from '@/store/modal';
import Image from 'next/image';
import Link from 'next/link';
import VideoCard from '@/components/VideoCard'
import CustomLoading from '@/components/CustomLoading';
import { useEffect, useState } from 'react';

const Profile = () => {

    const { user, myVideos, isDarkMode, language } = useAppContext();
    const [subscriberCount, setSubscriberCount] = useState("");

    const shareVideoModalOpen = async () => {

        store.dispatch(openModal({
            name: 'share-video-modal',
        }));

    }

    const editSubscriberCount = async () => {
        const text = language.includes("tr") ? " abone" : " subscriber";
        if (user.SubscriberCount >= 1000000000) {
            // Milyarlar
            setSubscriberCount((user.SubscriberCount / 1000000000).toFixed(0) + 'B ' + text);
        } else if (user.SubscriberCount >= 1000000) {
            // Milyonlar
            setSubscriberCount((user.SubscriberCount / 1000000).toFixed(0) + 'M ' + text);
        } else if (user.SubscriberCount >= 1000) {
            // Binler
            setSubscriberCount((user.SubscriberCount / 1000).toFixed(0) + 'K ' + text);
        } else {
            if (user.SubscriberCount === 0) {
                setSubscriberCount("0");
            } else {
                setSubscriberCount(user.SubscriberCount + text);
            }
        }
    }

    useEffect(() => {
        editSubscriberCount();
    }, [user]);


    if (user && myVideos) {
        return (
            <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <div className={`flex flex-col space-y-2 m-auto max-w-screen-xl h-full px-4`}>

                    <div className='w-full flex flex-row pt-4 select-none'>
                        <div className={`flex flex-1 flex-row space-x-3 items-center`}>
                            <Image
                                width={0}
                                height={0}
                                src={user.ImageUrl}
                                className='w-32 h-32 rounded-full'
                                alt="userImage"
                            />
                            <div className={`flex flex-1 flex-col h-full items-start justify-start text-sm`}>
                                <p className='font-bold text-lg'>{user.NickName}</p>
                                {user.FullName &&
                                    <p>{user.FullName}</p>}
                                <p>{language.includes("tr") ? "Abone - " : "Subscriber Count - "}{subscriberCount}</p>
                                <p>Video - {user.VideoCount}</p>
                                {user.Biography &&
                                    <p>{user.Biography}</p>}
                            </div>
                        </div>

                        <div className='flex flex-col space-y-3'>
                            <Link href={"/profileEdit"} className={`h-max px-3 py-1 rounded-lg font-semibold ${isDarkMode ? "text-white bg-slate-600 hover:bg-slate-500" : "text-black bg-gray-100 hover:bg-gray-200"}`}>
                                {language.includes("tr") ? "Profili Düzenle" : "Edit Profile"}
                            </Link>

                            <button onClick={() => shareVideoModalOpen()} className={`h-max px-3 py-1 rounded-lg font-semibold ${isDarkMode ? "text-white bg-slate-600 hover:bg-slate-500" : "text-black bg-gray-100 hover:bg-gray-200"}`}>
                                {language.includes("tr") ? "Video Paylaş" : "Share Video"}
                            </button>
                        </div>
                    </div>

                    <p className={`w-full font-bold border-b p-1 ${isDarkMode ? "text-white border-slate-400" : "text-black border-gray-300"}`}>
                        {language.includes("tr") ?
                            "Videolarım" : "My Videos"}
                    </p>

                    {myVideos.length !== 0 ?
                        <div className="w-full pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {myVideos.map(video => {
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
                            {language.includes("tr") ? `Henüz herhangi bir video paylaşımınız bulunmamaktadır.` : `You do not have any video shares yet.`}
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

export default Profile;