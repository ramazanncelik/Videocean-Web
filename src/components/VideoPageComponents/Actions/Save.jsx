import { useState } from 'react'
import { useAppContext } from '@/contexts/AppContext';
import { Menu } from '@headlessui/react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const Save = ({ saveId, handleSaveCheck, createSave, deleteSave }) => {

    const { language,getCurrentUserSavedVideos,user } = useAppContext();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        await setLoading(true);

        if (saveId) {
            await deleteSave();
        } else {
            await createSave();
        }

        await handleSaveCheck();
        await getCurrentUserSavedVideos(user._id);
        await setLoading(false);
    }

    return (
        <Menu.Item>
            {() => (
                <button
                    onClick={() => handleSubmit()}
                    disabled={loading}
                    className='w-full hover:bg-gray-200 text-black group flex flex-row space-x-1 items-center rounded-md px-2 py-2 text-sm'>
                    {saveId ?
                        <FaBookmark size={16} color='black' />
                        :
                        <FaRegBookmark size={16} color='black' />}

                    <span className={`flex flex-1`}>
                        {saveId ?
                            (language.includes("tr") ? "Kaydedilenlerden Sil" : "Delete from Saved")
                            :
                            (language.includes("tr") ? "Kaydet" : "Save")}
                    </span>
                </button>
            )}
        </Menu.Item>
    );
}

export default Save;