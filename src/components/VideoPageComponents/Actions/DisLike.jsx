"use client"
import { useAppContext } from '@/contexts/AppContext';
import { serverUrl } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { FaRegThumbsDown, FaThumbsDown } from 'react-icons/fa'

const DisLike = ({ videoId, getVideoInfo, videoInfo, handleLikeCheck, handleDisLikeCheck, disLikeId, likeId, createDisLike, deleteDisLike, deleteLike, loading, setLoading }) => {

    const { isDarkMode } = useAppContext();

    const handleSubmit = async () => {
        await setLoading(true);

        if (disLikeId) {
            await deleteDisLike();
        } else if (likeId) {
            await deleteLike();
            await createDisLike();
        } else {
            await createDisLike();
        }

        await handleLikeCheck();
        await handleDisLikeCheck();
        await getVideoInfo();
        await setLoading(false);
    }

    useEffect(() => {
        if (videoId) {
            handleDisLikeCheck();
        }
    }, [videoId])

    useEffect(() => {
        if (videoId) {
            handleDisLikeCheck();
        }
    }, [])

    return (
        <div>
            {disLikeId ?
                <div className='w-max h-max flex flex-row space-x-1 items-center justify-center'>
                    <FaThumbsDown
                        className='cursor-pointer'
                        onClick={() => { !loading && handleSubmit() }}
                        size={24}
                        color={isDarkMode ? "white" : "black"} />

                    <span>
                        {videoInfo.DisLike}
                    </span>
                </div>
                :
                <div className='w-max h-max flex flex-row space-x-1 items-center justify-center'>
                    <FaRegThumbsDown
                        className='cursor-pointer'
                        onClick={() => { !loading && handleSubmit() }}
                        size={24}
                        color={isDarkMode ? "white" : "black"} />

                    <span>
                        {videoInfo.DisLike}
                    </span>
                </div>}
        </div>
    );
}

export default DisLike;