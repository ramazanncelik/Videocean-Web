"use client"
import { useAppContext } from "@/contexts/AppContext"
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { newVideoValidations } from "@/utils/validations";
import { serverUrl } from "@/utils/utils";
import { videoCategories } from '@/utils/videoCategories'
import { useState } from "react";
import CustomLoading from "@/components/CustomLoading";
import { storage } from "@/utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ShareVideoModal = ({ close }) => {

    const { user, language, authToken, getCurrentUser } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [newVideoFiles, setNewVideoFiles] = useState({
        CoverPhoto: null,
        Video: null
    });

    const { handleChange, handleSubmit, values, errors, touched } = useFormik({
        initialValues: {
            Title: "",
            Description: "",
            Category: ""
        },
        onSubmit: async (values) => {
            await setLoading(true);
            const date = new Date();

            const coverPhotoReference = ref(storage, `VideosFiles/${user.Email}/${date}/coverPhoto`);
            await uploadBytes(coverPhotoReference, newVideoFiles.CoverPhoto);
            const coverPhotoUrl = await getDownloadURL(coverPhotoReference);

            const videoReference = ref(storage, `VideosFiles/${user.Email}/${date}/video`);
            await uploadBytes(videoReference, newVideoFiles.Video);
            const videoUrl = await getDownloadURL(videoReference);

            const url = serverUrl + "video";
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
                body: JSON.stringify({
                    OwnerId: user._id,
                    ...values,
                    CoverPhotoUrl: coverPhotoUrl,
                    VideoUrl: videoUrl,
                    Like: 0,
                    DisLike: 0,
                    Comment: 0,
                    ViewsCount: 0,
                    Date: new Date()
                }),
            });
            if (result) {
                const createdVideo = await result.json();
                if (createdVideo) {
                    await toast.success(language.includes("tr") ?
                        "Video başarılı bir şekilde paylaşıldı."
                        :
                        "The video has been successfully shared.");
                    getCurrentUser();
                    close();
                } else {
                    await toast.error(language.includes("tr") ?
                        "Video paylaşılırken bir hata oluştu."
                        :
                        "An error occurred while sharing the video.");
                }
            } else {
                await toast.error(language.includes("tr") ?
                    "Video paylaşılırken bir hata oluştu."
                    :
                    "An error occurred while sharing the video.");
            }

            await setLoading(false);
        },
        validationSchema: newVideoValidations(language)
    });

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        setNewVideoFiles({ ...newVideoFiles, CoverPhoto: file });
    };

    const handleVideoSelect = async (e) => {
        const file = e.target.files[0];
        setNewVideoFiles({ ...newVideoFiles, Video: file });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full h-auto p-2 bg-white rounded-lg flex flex-col">

            <div className={`w-full flex flex-row items-center pb-1 px-1 border-b border-gray-300`}>
                <div className={`flex flex-1 items-center text-black`}>
                    {language.includes("tr") ? "Video Paylaş" : "Share Video"}
                </div>

                <button type="button" onClick={() => close()} className={`p-2 rounded-lg hover:bg-gray-200`}>
                    <MdClose size={20} color="black" />
                </button>
            </div>

            <div className="flex flex-1 flex-col space-y-2 p-2 overflow-y-auto">
                <p className="font-bold">
                    {language.includes("tr") ?
                        "Başlık"
                        :
                        "Title"}
                </p>
                <input
                    className={`w-full md:w-96 p-2 border bg-white border-gray-300 rounded-lg`}
                    placeholder={language.includes("tr") ? "Başlık" : "Title"}
                    value={values.Title}
                    onChange={handleChange("Title")}
                    type="text"
                />
                {errors.Title && touched.Title &&
                    <div className="w-full bg-red-100 text-red-700 rounded-lg p-2">
                        {errors.Title}
                    </div>}
            </div>

            <div className="flex flex-1 flex-col space-y-2 p-2 overflow-y-auto">
                <p className="font-bold">
                    {language.includes("tr") ?
                        "Açıklama"
                        :
                        "Description"}
                </p>
                <textarea
                    className={`w-full md:w-96 h-24 max-h-24 p-2 border bg-white border-gray-300 rounded-lg`}
                    placeholder={language.includes("tr") ? "Açıklama" : "Description"}
                    value={values.Description}
                    onChange={handleChange("Description")}
                    type="text"
                />
                {errors.Description && touched.Description &&
                    <div className="w-full bg-red-100 text-red-700 rounded-lg p-2">
                        {errors.Description}
                    </div>}
            </div>
 
            <div className="flex flex-1 flex-col space-y-2 p-2 overflow-y-auto">
                <p className="font-bold">
                    {language.includes("tr") ?
                        "Kategori"
                        :
                        "Category"}
                </p>
                <select
                    className={`w-full md:w-96 p-2 border bg-white border-gray-300 rounded-lg`}
                    onChange={handleChange("Category")}
                    value={values.Category}
                >
                    {videoCategories.map(category => {
                        return (
                            <option key={category.id} value={category.value} selected={!category.value}>
                                {language.includes("tr") ? category.tr : category.en}
                            </option>
                        )
                    })}
                </select>
                {errors.Category && touched.Category &&
                    <div className="w-full bg-red-100 text-red-700 rounded-lg p-2">
                        {errors.Category}
                    </div>}
            </div>

            <div className="flex flex-1 flex-col space-y-2 p-2 overflow-y-auto">
                <p className="font-bold">
                    {language.includes("tr") ?
                        "Kapak Resmi"
                        :
                        "Cover Photo"}
                </p>
                <input
                    className={`w-full md:w-96 bg-white`}
                    onChange={handleImageSelect}
                    type="file"
                    accept="image/*"
                    required
                />
            </div>

            <div className="flex flex-1 flex-col space-y-2 p-2 overflow-y-auto mb-1">
                <p className="font-bold">
                    Video
                </p>
                <input
                    className={`w-full md:w-96 bg-white`}
                    onChange={handleVideoSelect}
                    type="file"
                    accept="video/*"
                    required
                />
                {errors.Video && touched.Video &&
                    <div className="w-full bg-red-100 text-red-700 rounded-lg p-2">
                        {errors.Video}
                    </div>}
            </div>

            {loading ?
                <CustomLoading
                    className="w-full h-max p-2 bg-blue-500 flex items-center justify-center rounded-lg"
                    size={12}
                    color={"white"}
                    type={"pacman"}
                /> :
                <button type="submit" className="w-full h-max p-2 bg-blue-500 hover:bg-blue-600 items-center rounded-lg">
                    <p className="text-white font-bold">
                        {language.includes("tr") ? "Paylaş" : "Share"}
                    </p>
                </button>}
        </form>
    )
}

export default ShareVideoModal;