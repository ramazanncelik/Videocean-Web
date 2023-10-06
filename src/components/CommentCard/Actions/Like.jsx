"use client";
import { useEffect } from 'react'
import { useAppContext } from '@/contexts/AppContext';
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';

const Like = ({ commentId, getComment, commentInfo, likeId, disLikeId, loading, setLoading, handleLikeCheck, handleDisLikeCheck, createLike, deleteLike, deleteDisLike }) => {

    const { isDarkMode } = useAppContext();

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
        await getComment();
        await setLoading(false);
    }

    useEffect(() => {
        if (commentId) {
            handleLikeCheck();
        }
    }, [commentId])

    useEffect(() => {
        if (commentId) {
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
                        size={16}
                        color={isDarkMode ? "white" : "black"} />

                    <span>
                        {commentInfo.Like}
                    </span>
                </div>
                :
                <div className='w-max h-max flex flex-row space-x-1 items-center justify-center'>
                    <FaRegThumbsUp
                        className='cursor-pointer'
                        onClick={() => { !loading && handleSubmit() }}
                        size={16}
                        color={isDarkMode ? "white" : "black"} />

                    <span>
                        {commentInfo.Like}
                    </span>
                </div>}
        </div>
    );
}

export default Like;