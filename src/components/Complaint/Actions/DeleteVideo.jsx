import { useAppContext } from '@/contexts/AppContext';
import { serverUrl } from '@/utils/utils';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CustomLoading from "@/components/CustomLoading";

const DeleteVideo = ({ videoId, getComplaints }) => {

    const { language, authToken, isDarkMode, getCurrentUser } = useAppContext();
    const [comments, setComments] = useState(null);
    const [loading, setLoading] = useState(false)

    const getComments = async () => {
        const url = serverUrl + `comment/videoComments/${videoId}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const comments = await result.json();
            if (comments) {
                await setComments(comments);
            } else {
                await setComments([]);
            }
        } else {
            await setComments([]);
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteLikes();
            await deleteVideo();
        } catch (error) {
            await errorToast();
        }
    }

    const deleteLikes = async () => {
        const url = serverUrl + `like_dislike/likes/${videoId}`;
        await deleteData(url);
        await deleteDisLikes();
    }

    const deleteDisLikes = async () => {
        const url = serverUrl + `like_dislike/disLikes/${videoId}`;
        await deleteData(url);
        await deleteComplaints();
    }

    const deleteComplaints = async () => {
        const url = serverUrl + `complaint/videoComplaints/${videoId}`;
        await deleteData(url);
        await deleteSaveds();
    }

    const deleteSaveds = async () => {
        const url = serverUrl + `savedvideo/videoSaveds/${videoId}`;
        await deleteData(url);
        await deleteComments();
    }

    const deleteComments = async () => {
        if (comments.length !== 0) {
            for (let i = 0; i < comments.length; i++) {
                const url = serverUrl + `comment/${comments[i]._id}`;
                await deleteData(url);
            }
        }
    }

    const deleteVideo = async () => {
        const url = serverUrl + `video/${videoId}`;
        await deleteData(url);
        await showSuccessToast();
        await getComplaints();
        await getCurrentUser();
        setLoading(false);
    }

    const deleteData = async (url) => {
        const result = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (!result.ok) {
            throw new Error("Delete operation failed");
        }
    }

    const showSuccessToast = async () => {
        await toast.success(
            language.includes("tr")
                ? "Video Başarılı Bir Şekilde Silindi."
                : "Video has been successfully deleted."
        );
    }

    const errorToast = async () => {
        await toast.error(
            language.includes("tr")
                ? "Video Silinirken Bir Hata ile Karşılaşıldı Lütfen Tekrar Deneyiniz."
                : "An Error Was Encountered While Deleting Video Please Try Again."
        );
    }

    useEffect(() => {

        getComments();

    }, [videoId])

    if (comments) {
        if (!loading) {
            return (
                <button
                    onClick={handleDelete}
                    className={`px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600`}>
                    {language.includes("tr") ? "Videoyu Sil" : "Delete Video"}
                </button>
            );
        } else {
            return (
                <CustomLoading
                    type={"pacman"}
                    color={isDarkMode ? "white" : "black"}
                    size={8}
                    className={`flex items-center justify-center px-6 py-3 rounded-lg border ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}
                />
            )
        }
    } else {
        return (
            <CustomLoading
                type={"hash"}
                color={isDarkMode ? "white" : "black"}
                size={12}
                className={`flex items-center justify-center px-6 py-3 rounded-lg border ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}
            />
        )
    }
}

export default DeleteVideo;
