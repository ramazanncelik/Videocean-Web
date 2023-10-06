"use client"
import { useAppContext } from "@/contexts/AppContext"
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { newComplaintValidations } from "@/utils/validations";
import { serverUrl } from "@/utils/utils";
import { reportTitleList } from '@/utils/reportTitleList'
import { useState } from "react";
import CustomLoading from "@/components/CustomLoading";

const ComplaintFormModal = ({ close, data }) => {

    const { user, language, authToken } = useAppContext();
    const [loading, setLoading] = useState(false);

    const { handleChange, handleSubmit, values, errors, touched } = useFormik({
        initialValues: {
            OwnerId: user._id,
            VideoId: data.videoId,
            Title: "",
            Description: "",
            Date: new Date()
        },
        onSubmit: async (values) => {
            await setLoading(true);

            const url = serverUrl + "complaint";
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
                body: JSON.stringify(values),
            });
            if (result) {
                const createdComplaint = await result.json();
                if (createdComplaint) {
                    await toast.success(language.includes("tr") ?
                        "Video başarılı bir şekilde bildirildi."
                        :
                        "The video has been reported successfully.");
                    await close();
                } else {
                    await toast.error(language.includes("tr") ?
                        "Video bildirilirken bir hata oluştu."
                        :
                        "An error occurred while reporting the video.");
                }
            } else {
                await toast.error(language.includes("tr") ?
                    "Video bildirilirken bir hata oluştu."
                    :
                    "An error occurred while reporting the video.");
            }

            await setLoading(false);
        },
        validationSchema: newComplaintValidations(language)
    });

    return (
        <form onSubmit={handleSubmit} className="w-full h-auto p-2 bg-white rounded-lg flex flex-col">

            <div className={`w-full flex flex-row items-center pb-1 px-1 border-b border-gray-300`}>
                <div className={`flex flex-1 items-center text-black`}>
                    {language.includes("tr") ? "Bildir" : "Report"}
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
                <select
                    className={`w-full md:w-96 p-2 border bg-white border-gray-300 rounded-lg`}
                    onChange={handleChange("Title")}
                    value={values.Title}
                    defaultValue={language.includes("tr") ? reportTitleList[0].tr : reportTitleList[0].en}
                >
                    {reportTitleList.map(title => {
                        return (
                            <option key={title.id} value={title.value} selected={!title.value}>
                                {language.includes("tr") ? title.tr : title.en}
                            </option>
                        )
                    })}
                </select>
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
                    style={{ minHeight: 96 }}
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

export default ComplaintFormModal;