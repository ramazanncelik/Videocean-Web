"use client"
import { useEffect, useState } from "react";
import { useAppContext } from '@/contexts/AppContext'
import { serverUrl } from '@/utils/utils';
import Like from "./Like";
import DisLike from "./DisLike";

const Actions = ({ commentId, getComment, commentInfo }) => {

    const { user, authToken } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [disLikeId, setDisLikeId] = useState(null);

    const handleLikeCheck = async () => {
        await setLoading(true);

        const url = serverUrl + `comment_like_dislike/like/${user._id}/${commentId}`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const like = await result.json();
            if (like.success) {
                setLikeId(like.result._id);
            } else {
                setLikeId(null);
            }
        }

        await setLoading(false);
    }

    const handleDisLikeCheck = async () => {
        await setLoading(true);

        const url = serverUrl + `comment_like_dislike/disLike/${user._id}/${commentId}`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const disLike = await result.json();
            if (disLike.success) {
                setDisLikeId(disLike.result._id);
            } else {
                setDisLikeId(null);
            }
        }

        await setLoading(false);
    }

    const createLike = async () => {
        await setLoading(true);

        const body = {
            UserId: user._id,
            CommentId: commentId
        }
        const url = serverUrl + `comment_like_dislike/like`;
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(body)
        });

        await setLoading(false);
    }

    const createDisLike = async () => {
        await setLoading(true);

        const body = {
            UserId: user._id,
            CommentId: commentId
        }
        const url = serverUrl + `comment_like_dislike/disLike`;
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(body)
        });

        await setLoading(false);
    }

    const deleteLike = async () => {
        await setLoading(true);

        const url = serverUrl + `comment_like_dislike/like/${likeId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });

        await setLoading(false);
    }

    const deleteDisLike = async () => {
        await setLoading(true);

        const url = serverUrl + `comment_like_dislike/disLike/${disLikeId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });

        await setLoading(false);
    }

    useEffect(() => {
        handleLikeCheck();
        handleDisLikeCheck();
    }, [commentId]);

    return (
        <div className="flex flex-1 flex-row items-center justify-start space-x-5">
            <Like
                commentId={commentId}
                getComment={getComment}
                commentInfo={commentInfo}
                likeId={likeId}
                disLikeId={disLikeId}
                loading={loading}
                setLoading={setLoading}
                handleLikeCheck={handleLikeCheck}
                handleDisLikeCheck={handleDisLikeCheck}
                createLike={createLike}
                deleteLike={deleteLike}
                deleteDisLike={deleteDisLike}
            />

            <DisLike
                commentId={commentId}
                getComment={getComment}
                commentInfo={commentInfo}
                likeId={likeId}
                disLikeId={disLikeId}
                loading={loading}
                setLoading={setLoading}
                handleLikeCheck={handleLikeCheck}
                handleDisLikeCheck={handleDisLikeCheck}
                createDisLike={createDisLike}
                deleteDisLike={deleteDisLike}
                deleteLike={deleteLike}
            />
        </div>
    );
}

export default Actions;