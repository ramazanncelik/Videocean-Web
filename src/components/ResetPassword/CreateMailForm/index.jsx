"use client"

import { createResetPasswordMailValidations } from "@/utils/validations";
import { useFormik } from "formik";
import { useMutation } from "@apollo/client";
import { createResetPasswordMail } from "@/apollo/User/userMutations";
import { toast } from "react-hot-toast";
import Loading from "@/components/Loading";
import { useAppContext } from '@/contexts/AppContext'

const CreateMailForm = () => {

    const { language, isDarkMode } = useAppContext();

    const [createMail, { loading }] = useMutation(createResetPasswordMail);

    const { handleChange, handleSubmit, handleBlur, handleReset, values, errors, touched } = useFormik({
        initialValues: {
            email: "",
        },
        onSubmit: async (values) => {
            const result = await createMail({
                variables: {
                    data: {
                        to: values.email,
                        subject: language === "tr" ? "Şifre Sıfırlama Maili" : "Password Reset Mail",
                        text: language === "tr" ? "Lütfen aşağıdaki linke tıklayarak şifrenizi değiştiriniz." : "Please change your password by clicking the link below.",
                    }
                }
            });
            if (result) {
                if (result.data) {
                    if (result.data.createResetPasswordMail) {
                        toast.success(language === "tr" ?
                            "Mail başarıyla gönderildi. Lütfen mail adresinizi kontrol ediniz." :
                            "Email sent successfully. Please check your e-mail address.");
                        handleReset();
                    } else {
                        toast.error(language === "tr" ?
                            "Mail gönderimi başarısızlıkla sonuçlandı. Lütfen tekrar deneyiniz." :
                            "Email sending failed. Please try again.");
                    }
                } else {
                    toast.error(language === "tr" ?
                        "Mail gönderimi başarısızlıkla sonuçlandı. Lütfen tekrar deneyiniz." :
                        "Email sending failed. Please try again.");
                }
            }
        },
        validationSchema: createResetPasswordMailValidations(language)
    });

    return (
        <div className={`mt-14 flex-1 ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
            <form onSubmit={handleSubmit} className={`flex flex-col space-y-2 items-center justify-center m-auto max-w-screen-xl h-full justify-center px-4`}>

                <p className={`w-72 md:w-96 text-center font-bold text-2xl ${isDarkMode ? "text-white" : "text-black"}`}>
                    {language === "tr" ? "Şifre Sıfırla" : "Reset Password"}
                </p>

                <div className="w-72 md:w-96 flex flex-col space-y-2">
                    <input
                        type="email"
                        className={`w-full mb-1 border p-2.5 rounded-lg text-sm ${isDarkMode ? "bg-slate-700 border-slate-500" : "bg-white border-gray-200"}`}
                        name="email"
                        placeholder={language === "tr" ? "E-mail adresi" : "E-mail adress"}
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                    />
                    {errors.email && touched.email &&
                        <p className="w-full bg-red-500 p-2 rounded text-white mb-3">
                            {errors.email}
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
                        {language === "tr" ? "Mail Al" : "Receive Mail"}
                    </button>}

            </form>
        </div>
    );
}

export default CreateMailForm;