"use client";
import { useEffect } from 'react'
import { useAppContext } from '@/contexts/AppContext';
import { FaRegThumbsDown, FaThumbsDown } from 'react-icons/fa';

const DisLike = ({ commentId, getComment, commentInfo, likeId, disLikeId, loading, setLoading, handleLikeCheck, handleDisLikeCheck, createDisLike, deleteLike, deleteDisLike }) => {

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
        await getComment();
        await setLoading(false);
    }

    useEffect(() => {
        if (commentId) {
            handleDisLikeCheck();
        }
    }, [commentId])

    useEffect(() => {
        if (commentId) {
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
                        size={16}
                        color={isDarkMode ? "white" : "black"} />

                    <span>
                        {commentInfo.DisLike}
                    </span>
                </div>
                :
                <div className='w-max h-max flex flex-row space-x-1 items-center justify-center'>
                    <FaRegThumbsDown
                        className='cursor-pointer'
                        onClick={() => { !loading && handleSubmit() }}
                        size={16}
                        color={isDarkMode ? "white" : "black"} />

                    <span>
                        {commentInfo.DisLike}
                    </span>
                </div>}
        </div>
    );
}

export default DisLike;