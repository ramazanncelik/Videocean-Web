"use client"
import { useAppContext } from '@/contexts/AppContext';
import { useEffect } from 'react';
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa'

const Like = ({ videoId, getVideoInfo, videoInfo, handleLikeCheck, handleDisLikeCheck, likeId, disLikeId, createLike, deleteLike, deleteDisLike, loading, setLoading }) => {

    const { isDarkMode, user, getCurrentUserLikedVideos } = useAppContext();

    const handleSubmit = async () => {
        await setLoading(true);

        if (likeId) {
            await deleteLike();
        } else if (disLikeId) {
            await deleteDisLike();
            await createLike();
        } else {
            await createLike();
        }

        await handleLikeCheck();
        await handleDisLikeCheck();
        await getVideoInfo();
        await getCurrentUserLikedVideos(user._id);
        await setLoading(false);
    }

    useEffect(() => {
        if (videoId) {
            handleLikeCheck();
        }
    }, [videoId])

    useEffect(() => {
        if (videoId) {
            handleLikeCheck();
        }
    }, [])

    return (
        <div>
            {likeId ?
                <div className='w-max h-max flex flex-row space-x-1 items-center justify-center'>
                    <FaThumbsUp
                        className='cursor-pointer'
                        onClick={() => { !loading && handleSubmit() }}
                        size={24}
                        color={isDarkMode ? "white" : "black"} />

                    <span>
                        {videoInfo.Like}
                    </span>
                </div>
                :
                <div className='w-max h-max flex flex-row space-x-1 items-center justify-center'>
                    <FaRegThumbsUp
                        className='cursor-pointer'
                        onClick={() => { !loading && handleSubmit() }}
                        size={24}
                        color={isDarkMode ? "white" : "black"} />

                    <span>
                        {videoInfo.Like}
                    </span>
                </div>}
        </div>
    );
}

export default Like;