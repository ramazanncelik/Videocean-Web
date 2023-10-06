"use client"
import { useState } from 'react'
import Like from './Like';
import DisLike from './DisLike';
import ActionsDropDown from './ActionsDropDown';
import { serverUrl } from '@/utils/utils';
import { useAppContext } from '@/contexts/AppContext';

const Actions = ({ videoId, getVideoInfo, videoInfo,comments }) => {

    const { authToken, user } = useAppContext();

    const [likeId, setLikeId] = useState(null);
    const [disLikeId, setDisLikeId] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLikeCheck = async () => {
        await setTimeout(async () => {
            const url = serverUrl + `like_disLike/like/${user._id}/${videoId}`
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
                    await setLikeId(like.result._id)
                } else {
                    await setLikeId(null)
                }
            }
        }, 100);
    }

    const handleDisLikeCheck = async () => {
        await setTimeout(async () => {
            const url = serverUrl + `like_disLike/disLike/${user._id}/${videoId}`
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
                    await setDisLikeId(disLike.result._id)
                } else {
                    await setDisLikeId(null)
                }
            }
        }, 100);
    }

    const createLike = async () => {
        await setLoading(true);

        const url = serverUrl + `like_disLike/like`;
        const body = {
            UserId: user._id,
            VideoId: videoId
        };
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

        const url = serverUrl + `like_disLike/disLike`;
        const body = {
            UserId: user._id,
            VideoId: videoId
        };
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

        const url = serverUrl + `like_disLike/like/${likeId}`;
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

        const url = serverUrl + `like_disLike/disLike/${disLikeId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });

        await setLoading(false);
    }

    return (
        <div className="flex flex-1 flex-row items-center justify-end space-x-5">
            <Like
                videoId={videoId}
                getVideoInfo={getVideoInfo}
                videoInfo={videoInfo}
                handleLikeCheck={handleLikeCheck}
                handleDisLikeCheck={handleDisLikeCheck}
                likeId={likeId}
                setLikeId={setLikeId}
                disLikeId={disLikeId}
                createLike={createLike}
                deleteDisLike={deleteDisLike}
                deleteLike={deleteLike}
                loading={loading}
                setLoading={setLoading} />

            <DisLike
                videoId={videoId}
                getVideoInfo={getVideoInfo}
                videoInfo={videoInfo}
                handleLikeCheck={handleLikeCheck}
                handleDisLikeCheck={handleDisLikeCheck}
                disLikeId={disLikeId}
                setDisLikeId={setDisLikeId}
                likeId={likeId}
                createDisLike={createDisLike}
                deleteDisLike={deleteDisLike}
                deleteLike={deleteLike}
                loading={loading}
                setLoading={setLoading} />

                <ActionsDropDown videoId={videoId} videoInfo={videoInfo} comments={comments} />
        </div>
    );
}

export default Actions;