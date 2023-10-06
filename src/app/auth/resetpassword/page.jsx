"use client"
import { useState } from 'react'
import { useFormik } from "formik";
import { useAppContext } from "@/contexts/AppContext";
import { updatePasswordValidations } from "@/utils/validations";
import { serverUrl } from '@/utils/utils';
import { toast } from 'react-hot-toast';
import CustomLoading from '@/components/CustomLoading';
import { useRouter } from 'next/navigation';

const ResetPassword = ({ searchParams }) => {

    const { isDarkMode, language } = useAppContext();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { handleChange, handleSubmit, handleReset, handleBlur, values, errors, touched } = useFormik({
        initialValues: {
            password: "",
            passwordConfirm: "",
        },
        onSubmit: async (values) => {
            await setLoading(true);

            const url = serverUrl + "auth/updatePassword";
            const updatePassword = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Email: searchParams.Email,
                    ConfirmationCode: searchParams.ConfirmationCode,
                    Password: values.password
                }),
            });
            const result = await updatePassword.json();
            if (result.success && result.userExist) {
                await toast.success(language.includes("tr") ?
                    "Şifre güncelleme başarıyla gerçekleşti."
                    :
                    "Password update was successful.")
                await handleReset();
                router.prefetch("/");
            } else {
                await toast.error(language.includes("tr") ?
                    "Şifre güncellenirken bir hata oluştu."
                    :
                    "An error occurred while updating the password.")
            }

            await setLoading(false);
        },
        validationSchema: updatePasswordValidations(language)
    });

    return (
        <div className={`mt-14 flex-1 ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
            <form onSubmit={handleSubmit} className={`flex flex-col space-y-2 items-center justify-center m-auto max-w-screen-xl h-full px-4`}>

                <p className={`w-72 md:w-96 text-center font-bold text-2xl ${isDarkMode ? "text-white" : "text-black"}`}>
                    {language === "tr" ? "Şifre Değiştir" : "Change Password"}
                </p>

                <div className="w-72 md:w-96 flex flex-col space-y-2">
                    <input
                        type="password"
                        className={`w-full mb-1 border p-2.5 rounded-lg text-sm ${isDarkMode ? "bg-slate-700 border-slate-500" : "bg-white border-gray-200"}`}
                        name="password"
                        placeholder={language === "tr" ? "Yeni Şifre" : "New Password"}
                        onChange={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                    />
                    {errors.password && touched.password &&
                        <p className="w-full bg-red-500 p-2 rounded text-white mb-3">
                            {errors.password}
                        </p>}
                </div>

                <div className="w-72 md:w-96 flex flex-col space-y-2">
                    <input
                        type="password"
                        className={`w-full mb-1 border p-2.5 rounded-lg text-sm ${isDarkMode ? "bg-slate-700 border-slate-500" : "bg-white border-gray-200"}`}
                        name="passwordConfirm"
                        placeholder={language === "tr" ? "Yeni Şifre Tekrarı" : "New Password Repeat"}
                        onChange={handleChange("passwordConfirm")}
                        onBlur={handleBlur("passwordConfirm")}
                        value={values.passwordConfirm}
                    />
                    {errors.passwordConfirm && touched.passwordConfirm &&
                        <p className="w-full bg-red-500 p-2 rounded text-white mb-3">
                            {errors.passwordConfirm}
                        </p>}
                </div>

                {loading ?
                    <CustomLoading
                        className="w-72 md:w-96 p-2 rounded-lg flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 font-bold"
                        type={"pacman"}
                        size={12}
                        color={"white"} /> :
                    <button
                        type="submit"
                        className="w-72 md:w-96 p-2 rounded-lg items-center justify-center bg-orange-500 text-white hover:bg-orange-600 font-bold">
                        {language === "tr" ? "Şifre Değiştir" : "Change Password"}
                    </button>}

            </form>
        </div>
    );
};

export default ResetPassword;