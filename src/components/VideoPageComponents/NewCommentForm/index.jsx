"use client"
import { useAppContext } from '@/contexts/AppContext';
import { useState } from 'react';
import Image from "next/image";
import { serverUrl } from '@/utils/utils';
import CustomLoading from '@/components/CustomLoading';
import { toast } from 'react-hot-toast';

const NewCommentForm = ({ videoId, getComments }) => {

    const { isDarkMode, language, user, authToken } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [newCommentDescription, setNewCommentDescription] = useState("");

    const handleSubmit = async () => {
        await setLoading(true);

        const url = serverUrl + "comment";
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({
                OwnerId: user._id,
                VideoId: videoId,
                Description: newCommentDescription,
                Date: new Date(),
                Like: 0,
                DisLike: 0,
            }),
        });
        if (result) {
            const commentCreated = await result.json();
            if (commentCreated) {
                await toast.success(language.includes("tr") ?
                    "Yorumunuz başarıyla paylaşıldı."
                    :
                    "Your comment has been successfully shared."
                );
                await getComments();
            } else {
                await toast.error(language.includes("tr") ?
                    "Yorumunuz paylaşılırken bir hata oluştu. Lütfen tekrar deneyiniz."
                    :
                    "An error occurred while posting your comment. Please try again."
                );
            }
        }

        await setNewCommentDescription("");
        await setLoading(false);
    }

    return (
        <div className='w-full flex flex-col space-y-2'>
            <div className='w-full flex flex-row space-x-2 items-center'>
                <Image
                    width={0}
                    height={0}
                    src={user.ImageUrl}
                    className='w-12 h-12 rounded-full select-none'
                    alt="userImage"
                />

                <textarea
                    className={`w-full h-16 max-h-16 rounded-lg p-1.5 border ${isDarkMode ? "bg-slate-600 border-slate-400" : "bg-gray-100 border-gray-300"}`}
                    style={{ minHeight: 64 }}
                    value={newCommentDescription}
                    onChange={(e) => setNewCommentDescription(e.target.value)}
                    placeholder={language.includes("tr") ? "Yorumunuz" : "Your Comment"} />
            </div>

            {newCommentDescription.length !== 0 &&
                <div className='w-full flex flex-row space-x-2 items-center justify-end'>
                    {!loading &&
                        <button
                            className={`py-2 px-5 rounded-lg ${isDarkMode ? "bg-slate-600 hover:bg-slate-500" : "bg-gray-100 hover:bg-gray-200"}`}
                            onClick={() => setNewCommentDescription("")}>
                            {language.includes("tr") ? "İptal" : "Cancel"}
                        </button>}

                    {!loading &&
                        <button
                            className={`py-2 px-5 rounded-lg font-bold bg-orange-500 hover:bg-orange-600 text-white`}
                            onClick={() => handleSubmit()}
                            disabled={loading}>
                            {language.includes("tr") ? "Paylaş" : "Share"}
                        </button>
                        ||
                        <CustomLoading
                            type={"pacman"}
                            size={8}
                            color={"white"}
                            className='flex justify-center w-24 py-2 bg-orange-500 text-white font-bold rounded-lg' />}
                </div>}
        </div>
    );
}

export default NewCommentForm;