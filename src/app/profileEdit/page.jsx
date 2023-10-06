"use client";
import CustomLoading from '@/components/CustomLoading';
import { useAppContext } from '@/contexts/AppContext'
import { serverUrl } from '@/utils/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { storage } from '@/utils/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const ProfileEdit = () => {

    const { user, isDarkMode, language, authToken, getCurrentUser } = useAppContext();
    const [profileEditData, setProfileEditData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        await setLoading(true);
        const url = serverUrl + `user/${user._id}`;
        if (profileEditData.ImageUrl.newImage) {
            const reference = ref(storage, `UsersProfileImages/${user.Email}/image`)
            await uploadBytes(reference, profileEditData.ImageUrl.newImage);
            const imageUrl = await getDownloadURL(reference);

            const result = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
                body: JSON.stringify(profileEditData.Password !== "" ?
                    profileEditData
                    :
                    {
                        ImageUrl: imageUrl,
                        NickName: profileEditData.NickName,
                        FullName: profileEditData.FullName,
                        Biography: profileEditData.Biography,
                    }),
            });
            if (result) {
                getCurrentUser();
                await toast.success(language.includes("tr") ?
                    "Profiliniz başarılı bir şekilde güncellendi."
                    :
                    "Your profile has been successfully updated."
                );
            } else {
                await toast.success(language.includes("tr") ?
                    "Profiliniz güncellenirken bir hata oluştu lütfen tekrar deneyiniz."
                    :
                    "An error occurred while updating your profile, please try again."
                );
            }
            setProfileEditData({ ...profileEditData, ImageUrl: { url: imageUrl, newImage: null } });
        } else {
            const result = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
                body: JSON.stringify(profileEditData.Password !== "" ?
                    profileEditData
                    :
                    {
                        ImageUrl: user.ImageUrl,
                        NickName: profileEditData.NickName,
                        FullName: profileEditData.FullName,
                        Biography: profileEditData.Biography,
                    }),
            });
            if (result) {
                getCurrentUser();
                await toast.success(language.includes("tr") ?
                    "Profiliniz başarılı bir şekilde güncellendi."
                    :
                    "Your profile has been successfully updated."
                );
            } else {
                await toast.success(language.includes("tr") ?
                    "Profiliniz güncellenirken bir hata oluştu lütfen tekrar deneyiniz."
                    :
                    "An error occurred while updating your profile, please try again."
                );
            }
            setProfileEditData({ ...profileEditData, ImageUrl: { url: user.ImageUrl, newImage: null } });
        }
        await setLoading(false);
    }

    useEffect(() => {
        if (user) {
            setProfileEditData({
                ImageUrl: { url: user.ImageUrl, newImage: null },
                NickName: user.NickName,
                FullName: user.FullName,
                Biography: user.Biography,
                Password: ""
            });
        }
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        setProfileEditData({ ...profileEditData, ImageUrl: { url: user.ImageUrl, newImage: file } });
    };

    if (profileEditData) {
        return (
            <div className={`mt-14 flex-1 ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <div className={`flex flex-col pt-4 items-center space-y-2 m-auto max-w-screen-xl h-full px-4`}>

                    <Image
                        width={0}
                        height={0}
                        src={user.ImageUrl}
                        className='w-32 h-32 rounded-full'
                        alt="userImage"
                    />

                    <form onSubmit={handleSubmit} className='w-72 md:w-[50%] h-max flex flex-col space-y-3 items-center'>

                        <input
                            type="file"
                            accept="image/*"
                            className='w-72 md:w-96'
                            onChange={handleImageUpload}
                        />

                        <div className="flex flex-col flex-1 md:w-96 space-y-2 items-center">
                            <input
                                className={`w-72 md:w-96 p-2 border rounded-lg ${isDarkMode ? "bg-slate-700 border-slate-400" : "bg-white border-gray-400"}`}
                                placeholder={language.includes("tr") ? "Kullanıcı Adı" : "Nick Name"}
                                value={profileEditData.NickName}
                                onChange={(e) => setProfileEditData({ ...profileEditData, NickName: e.currentTarget.value })}
                                type="text"
                            />
                            {(profileEditData.NickName.length > 50 || profileEditData.NickName.length < 1) && (
                                <p className="flex-1 p-2 rounded-lg bg-red-100 text-red-700">
                                    {language.includes("tr")
                                        ? "Kullanıcı adı en az 1 en fazla 50 karakter içermelidir."
                                        : "Username must contain at least 1 and maximum 50 characters."}
                                </p>
                            ) ||
                                profileEditData.NickName.includes(" ") &&
                                <p className="flex-1 p-2 rounded-lg bg-red-100 text-red-700">
                                    {language.includes("tr")
                                        ? "Kullanıcı adı içerisinde boşluk karakteri olmamalıdır."
                                        : "There should be no spaces in the username."}
                                </p>}
                        </div>

                        <div className="flex flex-col flex-1 md:w-96 space-y-2 items-center">
                            <input
                                className={`w-72 md:w-96 p-2 border rounded-lg ${isDarkMode ? "bg-slate-700 border-slate-400" : "bg-white border-gray-400"}`}
                                placeholder={language.includes("tr") ? "Ad Soyad" : "Full Name"}
                                value={profileEditData.FullName}
                                onChange={(e) => setProfileEditData({ ...profileEditData, FullName: e.currentTarget.value })}
                                type="text"
                            />
                        </div>

                        <div className="flex flex-col flex-1 md:w-96 space-y-2 items-center">
                            <input
                                className={`w-72 md:w-96 p-2 border rounded-lg ${isDarkMode ? "bg-slate-700 border-slate-400" : "bg-white border-gray-400"}`}
                                placeholder={language.includes("tr") ? "Biyografi" : "Biography"}
                                value={profileEditData.Biography}
                                onChange={(e) => setProfileEditData({ ...profileEditData, Biography: e.currentTarget.value })}
                                type="text"
                            />
                        </div>

                        <div className="flex flex-col flex-1 md:w-96 space-y-2 items-center">
                            <input
                                className={`w-72 md:w-96 p-2 border rounded-lg ${isDarkMode ? "bg-slate-700 border-slate-400" : "bg-white border-gray-400"}`}
                                placeholder={language.includes("tr") ? "Şifre" : "Password"}
                                value={profileEditData.Password}
                                onChange={(e) => setProfileEditData({ ...profileEditData, Password: e.currentTarget.value })}
                                type="text"
                            />
                        </div>

                        <div className="w-72 md:w-96">
                            {!loading ?
                                <button type='submit' className='w-72 md:w-96 px-4 py-1 bg-orange-500 text-white font-bold hover:bg-orange-600 rounded-lg'>
                                    {language.includes("tr") ? "Güncelle" : "Update"}
                                </button>
                                :
                                <CustomLoading
                                    type={"pacman"}
                                    size={12}
                                    color={"white"}
                                    className='flex justify-center w-72 md:w-96 p-2 bg-orange-500 text-white font-bold rounded-lg' />}
                        </div>

                    </form>

                </div>
            </div>
        );
    } else {
        return (
            <div className={`mt-14 flex-1 ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <CustomLoading
                    type={"hash"}
                    color={isDarkMode ? "white" : "black"}
                    size={24}
                    className={`flex flex-col pt-4 items-center justify-center space-y-2 m-auto max-w-screen-xl h-full px-4`}
                />
            </div>
        )
    }
}

export default ProfileEdit;