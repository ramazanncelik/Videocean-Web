"use client";
import Image from 'next/image'
import { useEffect, useState } from 'react';
import CustomLoading from '../CustomLoading';
import { useAppContext } from '@/contexts/AppContext';
import { serverUrl } from '@/utils/utils';
import DeleteComment from './Actions/Delete'
import Actions from './Actions'

const CommentCard = ({ commentId, getComments }) => {

    const { isDarkMode, authToken, language, user } = useAppContext();
    const [commentInfo, setCommentInfo] = useState(null);
    const [commentOwner, setCommentOwner] = useState(null);
    const [date, setDate] = useState("")

    const getComment = async () => {
        const url = serverUrl + `comment/${commentId}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const comment = await result.json();
            if (comment) {
                await setCommentInfo(comment);
            } else {
                await setCommentInfo(null);
            }
        } else {
            await setCommentInfo(null);
        }
    }

    const getCommentOwner = async () => {
        const url = serverUrl + `user/${commentInfo.OwnerId}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const user = await result.json();
            if (user) {
                await setCommentOwner(user);
            } else {
                await setCommentOwner(null);
            }
        } else {
            await setCommentOwner(null);
        }
    }

    const editDate = () => {
        const commentDate = new Date(commentInfo.Date);
        const currentDate = new Date();

        const timeDiff = Math.abs(currentDate - commentDate);

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
            if (secondsDiff !== 0) {
                setDate(`${secondsDiff} ${language.includes("tr") ? "saniye önce" : "seconds ago"}`);
            } else {
                setDate(language.includes("tr") ? "Şimdi" : "Now");
            }
        }
    };

    useEffect(() => {
        if (commentInfo) {
            getCommentOwner();
            editDate();
        }
    }, [commentInfo]);

    useEffect(() => {
        if (commentId) {
            getComment();
        }
    }, [commentId]);

    if (commentInfo && commentOwner) {
        return (
            <div className="w-full flex flex-col space-y-1">
                <div className="w-full flex flex-row space-x-3">
                    <Image
                        width={0}
                        height={0}
                        className='w-8 h-8 rounded-full select-none'
                        src={commentOwner.ImageUrl}
                        alt={commentOwner.Email}
                    />

                    <div className='w-full flex flex-col space-y-1'>
                        <div className='w-full flex flex-row items-center'>
                            <div className='flex flex-1 flex-row space-x-5 items-center'>
                                <span className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
                                    {commentOwner.NickName}
                                </span>

                                <span className={`text-sm ${isDarkMode ? "text-white" : "text-black"}`}>
                                    {date}
                                </span>
                            </div>


                            {authToken &&
                                (commentInfo.OwnerId === user._id &&
                                    <DeleteComment commentId={commentId} getComments={getComments} />)}
                        </div>

                        <span className={`w-full ${isDarkMode ? "text-white" : "text-black"}`}>
                            {commentInfo.Description}
                        </span>

                        {authToken &&
                            <Actions
                                commentId={commentId}
                                getComment={getComment}
                                commentInfo={commentInfo} />}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <CustomLoading
                className={`w-full flex items-center justify-center p-3 rounded-lg border ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}
                type={"hash"}
                color={isDarkMode ? "white" : "black"}
                size={16}
            />
        )
    }
}

export default CommentCard;