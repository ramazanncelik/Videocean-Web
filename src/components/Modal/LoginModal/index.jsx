"use client"
import { useAppContext } from "@/contexts/AppContext"
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { loginValidations } from "@/utils/validations";
import { serverUrl } from "@/utils/utils";
import { useState } from "react";
import CustomLoading from "@/components/CustomLoading"

const LoginModal = ({ close }) => {

    const { language, changeAuthToken } = useAppContext();
    const [loading, setLoading] = useState(false)

    const { handleChange, handleSubmit, handleReset, values, errors, touched } = useFormik({
        initialValues: {
            Email: "",
            Password: "",
        },
        onSubmit: async (values) => {
            await setLoading(true);
            const url = serverUrl + "auth/login";
            const login = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            const result = await login.json();
            if (result.success) {
                await toast.success(language.includes("tr") ?
                    "Giriş başarılı bir şekilde gerçekleştirildi."
                    :
                    "Login was successful.")
                await changeAuthToken(result.authToken);
                await setLoading(false);
                await handleReset();
                await close();
            } else {
                if (result.isThereUser === false && result.isPasswordCorrect === false) {
                    await toast.error(language.includes("tr") ?
                        "Girdiğiniz e-posta adresine ait bir hesap bulunmamaktadır."
                        :
                        "There is no account belonging to the e-mail address you entered.");
                } else if (result.isThereUser === true && result.isPasswordCorrect === false) {
                    await toast.error(language.includes("tr") ?
                        "Şifrenizi yanlış girdiniz."
                        :
                        "You entered your password incorrectly.");
                } else {
                    await toast.error(result.response);
                }
            }
            await setLoading(false);
        },
        validationSchema: loginValidations(language)
    });

    return (
        <form onSubmit={handleSubmit} className="w-full h-auto p-2 bg-white rounded-lg flex flex-col space-y-2">

            <div className={`w-full flex flex-row items-center pb-1 px-1 border-b border-gray-300`}>
                <div className={`flex flex-1 items-center text-black`}>
                    {language.includes("tr") ? "Giriş Yap" : "Login"}
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

            <div className="flex flex-1 flex-col space-y-2 p-2 overflow-y-auto">
                <input
                    className={`w-full md:w-96 p-2 border bg-white border-gray-300 rounded-lg`}
                    placeholder={language.includes("tr") ? "Şifreniz" : "Your Password"}
                    value={values.Password}
                    onChange={handleChange("Password")}
                    type="password"
                />
                {errors.Password && touched.Password &&
                    <div className="w-full bg-red-100 text-red-700 rounded-lg p-2">
                        {errors.Password}
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
                        {language.includes("tr") ? "Giriş Yap" : "Login"}
                    </p>
                </button>}
        </form>
    )
}

export default LoginModal