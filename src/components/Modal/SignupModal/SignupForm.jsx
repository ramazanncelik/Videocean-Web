"use client"
import { useAppContext } from "@/contexts/AppContext"
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { MdClose } from "react-icons/md";
import CustomLoading from "@/components/CustomLoading"
import { signUpValidations } from "@/utils/validations";
import { defaultImage, serverUrl } from "@/utils/utils";
import { useState } from "react";

const SignupForm = ({ close, usageAgreementsToggle }) => {

    const { language } = useAppContext();
    const [usageAgreement, setUsageAgreement] = useState(false);
    const [loading, setLoading] = useState(false)

    const { handleChange, handleSubmit, handleReset, values, errors, touched } = useFormik({
        initialValues: {
            Email: "",
            NickName: "",
            Password: "",
            PasswordConfirm: "",
        },
        onSubmit: async (values) => {
            await setLoading(true);
            if (usageAgreement) {
                const url = serverUrl + "auth/signup";
                const body = {
                    Email: values.Email,
                    Password: values.Password,
                    NickName: values.NickName,
                    FullName: "",
                    Biography: "",
                    ImageUrl: defaultImage,
                    SubscriberCount: 0,
                    VideoCount: 0,
                    ConfirmationCode: (Math.floor(Math.random() * 90000) + 10000).toString(),
                    Role: "User",
                    EmailVerify: false,
                    UsageAgreement: true,
                }
                const signup = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });
                const result = await signup.json();
                if (result.success) {
                    await toast.success(language.includes("tr") ?
                        "Kayıt İşlemi Başarılı Bir Şekilde Gerçekleştirildi."
                        :
                        "The Registration Process Has Been Successfully Done.");
                    await handleReset();
                    await close();
                } else {
                    await toast.error(language.includes("tr") ?
                        `Girdiğiniz ${result.emailExist && "E-mail adresi" || result.nickNameExist && "Kullanıcı Adı"} bir başka kullanıcı tarafından kullanılmaktadır.`
                        :
                        `The ${result.emailExist && "E-mail adress" || result.nickNameExist && "Nick Name"} you entered is being used by another user.`)
                }
            } else {
                await toast.error(language.includes("tr") ?
                    "Lütfen Kullanım Koşullarını Onaylayınız!" :
                    "Please Confirm the Terms of Use!");
            }
            await setLoading(false);
        },
        validationSchema: signUpValidations(language)
    });

    return (
        <form onSubmit={handleSubmit} className="w-full h-auto p-2 bg-white rounded-lg flex flex-col space-y-5 overflow-y-auto">

            <div className={`w-full flex flex-row items-center pb-1 px-1 border-b border-gray-300`}>
                <div className={`flex flex-1 items-center text-black`}>
                    {language.includes("tr") ? "Kayıt Ol" : "Sign Up"}
                </div>

                <button type="button" onClick={() => close()} className={`p-2 rounded-lg hover:bg-gray-200`}>
                    <MdClose size={20} color="black" />
                </button>
            </div>

            <div className="flex flex-1 flex-col space-y-2 px-2">
                <input
                    className={`w-full md:w-96 p-2 border bg-white border-gray-300 rounded-lg`}
                    placeholder={language.includes("tr") ? "Email adresi" : "Email Adress"}
                    value={values.Email}
                    onChange={handleChange("Email")}
                    type="email"
                />
                {errors.Email && touched.Email &&
                    <div className="w-full bg-red-100 text-red-700 rounded-lg p-2">
                        {errors.Email}
                    </div>}
            </div>

            <div className="flex flex-1 flex-col space-y-2 px-2">
                <input
                    className={`w-full md:w-96 p-2 border bg-white border-gray-300 rounded-lg`}
                    placeholder={language.includes("tr") ? "Kullanıcı Adı" : "Nick Name"}
                    value={values.NickName}
                    onChange={handleChange("NickName")}
                    type="text"
                />
                {errors.NickName && touched.NickName &&
                    <div className="w-full bg-red-100 text-red-700 rounded-lg p-2">
                        {errors.NickName}
                    </div>}
            </div>

            <div className="flex flex-1 flex-col space-y-2 px-2">
                <input
                    className={`w-full md:w-96 p-2 border bg-white border-gray-300 rounded-lg`}
                    placeholder={language.includes("tr") ? "Şifre" : "Password"}
                    value={values.Password}
                    onChange={handleChange("Password")}
                    type="password"
                />
                {errors.Password && touched.Password &&
                    <div className="w-full bg-red-100 text-red-700 rounded-lg p-2">
                        {errors.Password}
                    </div>}
            </div>

            <div className="flex flex-1 flex-col space-y-2 px-2">
                <input
                    className={`w-full md:w-96 p-2 border bg-white border-gray-300 rounded-lg`}
                    placeholder={language.includes("tr") ? "Şifre Tekrarı" : "Repeat Password"}
                    value={values.PasswordConfirm}
                    onChange={handleChange("PasswordConfirm")}
                    type="password"
                />
                {errors.PasswordConfirm && touched.PasswordConfirm &&
                    <div className="w-full bg-red-100 text-red-700 rounded-lg p-2">
                        {errors.PasswordConfirm}
                    </div>}
            </div>

            <div className="flex flex-1 flex-row items-center space-x-2 px-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        value={usageAgreement}
                        onChange={(e) => setUsageAgreement(!usageAgreement)}
                        className="w-4 h-4" />
                </div>
                {language.includes("tr") ?
                    <div className="flex flex-row space-x-2 items-center justify-center">
                        <button type="button" onClick={() => usageAgreementsToggle()}>
                            <p className="text-blue-500 font-bold underline">
                                Kullanım Şartlarını
                            </p>
                        </button>
                        <p className="text-black">
                            onaylıyorum.
                        </p>
                    </div> :
                    <div className="flex flex-row space-x-2 items-center justify-center">
                        <p className="text-black">
                            I accept the
                        </p>
                        <button type="button" onClick={() => usageAgreementsToggle()}>
                            <p className="text-blue-500 font-bold underline">
                                Terms of Use
                            </p>
                        </button>
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
                        {language.includes("tr") ? "Kayıt Ol" : "Sign Up"}
                    </p>
                </button>}
        </form>
    );
}

export default SignupForm;