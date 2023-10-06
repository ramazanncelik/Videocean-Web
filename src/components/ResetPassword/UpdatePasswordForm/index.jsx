"use client"

import { updatePasswordValidations } from "@/utils/validations";
import { useFormik } from "formik";
import { useMutation } from "@apollo/client";
import { updatePassword } from "@/apollo/User/userMutations";
import { toast } from "react-hot-toast";
import Loading from "@/components/Loading";
import { useAppContext } from '@/contexts/AppContext'
import { useRouter } from "next/navigation";

const UpdatePasswordForm = ({ searchParamsData }) => {

    const { language, isDarkMode } = useAppContext();
    const router = useRouter();
    const [changePassword, { loading }] = useMutation(updatePassword);

    const { handleChange, handleSubmit, handleBlur, handleReset, values, errors, touched } = useFormik({
        initialValues: {
            password: "",
            passwordConfirm: "",
        },
        onSubmit: async (values) => {
            const result = await changePassword({
                variables: {
                    data: {
                        Email: searchParamsData.Email,
                        ConfirmationCode: searchParamsData.ConfirmationCode,
                        Password: values.password
                    }
                }
            });
            if (result) {
                if (result.data) {
                    if (result.data.updatePassword) {
                        toast.success(language === "tr" ?
                            "Şifreniz başarılı bir şekilde değiştirildi." :
                            "Your password has been successfully changed.");
                        handleReset();
                        router.replace("/auth/resetpassword");
                    } else {
                        toast.error(language === "tr" ?
                            "Şifre değiştirme işlemi başarısızlıkla sonuçlandı." :
                            "Password change failed.");
                    }
                } else {
                    toast.error(language === "tr" ?
                        "Şifre değiştirme işlemi başarısızlıkla sonuçlandı." :
                        "Password change failed.");
                }
            }
        },
        validationSchema: updatePasswordValidations(language)
    });

    return (
        <div className={`mt-14 flex-1 ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
            <form onSubmit={handleSubmit} className={`flex flex-col space-y-2 items-center justify-center m-auto max-w-screen-xl h-full justify-center px-4`}>

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
                    <div className={`w-72 md:w-96 p-2 rounded-lg items-center justify-center flex flex-row border ${isDarkMode ? "border-slate-500" : "border-gray-200"}`}>
                        <Loading />
                    </div> :
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-72 md:w-96 p-2 rounded-lg items-center justify-center bg-orange-500 text-white hover:bg-orange-600 font-bold">
                        {language === "tr" ? "Şifre Değiştir" : "Change Password"}
                    </button>}

            </form>
        </div>
    );
}

export default UpdatePasswordForm;