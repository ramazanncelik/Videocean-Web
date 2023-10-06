import { useAppContext } from '@/contexts/AppContext';
import { serverUrl } from '@/utils/utils';
import { Menu } from '@headlessui/react'
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

const Delete = ({ videoId, comments }) => {

    const { language, authToken, getCurrentUser } = useAppContext();
    const router = useRouter();

    const handleDelete = async () => {
        try {
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
        await getCurrentUser();
        router.replace("/profile");
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
                ? "Videonuz Başarılı Bir Şekilde Silindi."
                : "Your video has been successfully deleted."
        );
    }

    const errorToast = async () => {
        await toast.error(
            language.includes("tr")
                ? "Videonuz Silinirken Bir Hata ile Karşılaşıldı Lütfen Tekrar Deneyiniz."
                : "An Error Was Encountered While Deleting Your Video Please Try Again."
        );
    }

    return (
        <Menu.Item>
            {() => (
                <button
                    onClick={handleDelete}
                    className={`hover:bg-gray-200 text-black group flex flex-row space-x-1 w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                    <FaTrash size={16} color='black' />

                    <span className={`flex flex-1`}>
                        {language.includes("tr") ? "Sil" : "Delete"}
                    </span>
                </button>
            )}
        </Menu.Item>
    );
}

export default Delete;
