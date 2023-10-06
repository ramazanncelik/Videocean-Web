"use client"
import { useAppContext } from "@/contexts/AppContext"
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { createResetPasswordMailValidations } from "@/utils/validations";
import { serverUrl } from "@/utils/utils";
import { useState } from "react";
import CustomLoading from "@/components/CustomLoading"

const ResetPasswordModal = ({ close }) => {

    const { language } = useAppContext();
    const [loading, setLoading] = useState(false)

    const { handleChange, handleSubmit, handleReset, values, errors, touched } = useFormik({
        initialValues: {
            Email: "",
        },
        onSubmit: async (values) => {
            await setLoading(true);

            const url = serverUrl + "auth/getResetPasswordMail";
            const getMail = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: values.Email,
                    subject: language === "tr" ? "Şifre Sıfırlama Maili" : "Password Reset Mail",
                    text: language === "tr" ? "Lütfen aşağıdaki linke tıklayarak şifrenizi değiştiriniz." : "Please change your password by clicking the link below.",
                }),
            });
            const result = await getMail.json();
            if (result.success && result.isThereUser) {
                await toast.success(language.includes("tr") ?
                    "Şifre sıfırlama maili başarıyla mail adresinize gönderildi."
                    :
                    "Password reset email has been successfully sent to your email address.")
                await setLoading(false);
                await handleReset();
                await close();
            } else if (result.success && result.isThereUser === false) {
                await toast.error(language.includes("tr") ?
                    "Girdiğiniz e-posta adresine ait bir kullanıcı bulunmamaktadır."
                    :
                    "There is no user belonging to the e-mail address you entered.")
                await setLoading(false);
            } else {
                await toast.error(language.includes("tr") ?
                    "Şifre sıfırlama mail e-posta adresinize gönderilirken bir hata oluştu."
                    :
                    "There was an error sending the password reset email to your email address.")
            }

            await setLoading(false);
        },
        validationSchema: createResetPasswordMailValidations(language)
    });

    return (
        <form onSubmit={handleSubmit} className="w-full h-auto p-2 bg-white rounded-lg flex flex-col space-y-2">

            <div className={`w-full flex flex-row items-center pb-1 px-1 border-b border-gray-300`}>
                <div className={`flex flex-1 items-center text-black`}>
                    {language.includes("tr") ? "Şifre Sıfırla" : "Reset Password"}
                </div>

                <button type="button" onClick={() => close()} className={`p-2 rounded-lg hover:bg-gray-200`}>
                    <MdClose size={20} color="black" />
                </button>
            </div>

            <div className="flex flex-1 flex-col space-y-2 p-2 overflow-y-auto">
                <input
                    className={`w-full md:w-96 p-2 border bg-white border-gray-300 rounded-lg`}
                    placeholder={language.includes("tr") ? "Email adresiniz" : "Your Email Adress"}
                    value={values.Email}
                    onChange={handleChange("Email")}
                    type="email"
                />
                {errors.Email && touched.Email &&
                    <div className="w-full bg-red-100 text-red-700 rounded-lg p-2">
                        {errors.Email}
                    </div>}
            </div>

            {loading ?
                <CustomLoading
                    className="w-full h-max p-2 bg-orange-500 flex items-center justify-center rounded-lg"
                    size={12}
                    color={"white"}
                    type={"pacman"}
                /> :
                <button type="submit" className="w-full h-max p-2 bg-orange-500 hover:bg-orange-600 items-center rounded-lg">
                    <p className="text-white font-bold">
                        {language.includes("tr") ? "Mail Al" : "Get Mail"}
                    </p>
                </button>}
        </form>
    )
}

export default ResetPasswordModal