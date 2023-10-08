"use client";
import { useEffect, useState } from "react";
import { useAppContext } from '@/contexts/AppContext'
import { serverUrl } from '@/utils/utils';
import { toast } from 'react-hot-toast'
import CustomLoading from "@/components/CustomLoading";
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const EmailVerify = ({ searchParams }) => {

    const { isDarkMode, language } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [emailVerifyResult, setEmailVerifyResult] = useState(null);

    const updateEmailVerify = async () => {
        await setLoading(true);

        const url = serverUrl + `auth/updateEmailVerify`;
        const updateEmailVerifyResult = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Email: searchParams.Email,
                ConfirmationCode: searchParams.ConfirmationCode,
            })
        });

        if (updateEmailVerifyResult) {
            const result = await updateEmailVerifyResult.json();
            await setEmailVerifyResult(result);
            if (result.success) {
                await toast.success(language.includes("tr") ?
                    "E-mail adresiniz başarılı bir şekilde doğrulandı."
                    :
                    "Your e-mail address has been successfully verified.");
            } else {
                await toast.error(language.includes("tr") ?
                    "E-mail adresiniz doğrulanırken bir hata ile karşılaşıldı."
                    :
                    "An error was encountered while verifying your e-mail address.");
            }
        } else {
            await toast.error(language.includes("tr") ?
                "E-mail adresiniz doğrulanırken bir hata ile karşılaşıldı."
                :
                "An error was encountered while verifying your e-mail address.");
        }

        await setLoading(false);
    }

    useEffect(() => {
        if (searchParams && searchParams.Email && searchParams.ConfirmationCode) {
            updateEmailVerify();
        }
    }, [searchParams]);

    if (searchParams && searchParams.Email && searchParams.ConfirmationCode) {
        return (
            <div className={`mt-14 flex-1 ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <div className={`flex flex-col space-y-2 items-center justify-center m-auto max-w-screen-xl h-full px-4`}>

                    {(!loading && emailVerifyResult) ?
                        (<div className={`w-64 flex flex-col space-y-2 p-5 rounded-lg ${isDarkMode ? "bg-slate-600" : "bg-gray-100"}`}>
                            <span className='w-full flex items-center justify-center'>
                                {emailVerifyResult.success ?
                                    <FaCheckCircle
                                        size={64}
                                        color={isDarkMode ? "lightgreen" : "green"}
                                    />
                                    :
                                    <FaExclamationCircle
                                        size={64}
                                        color={"red"}
                                    />}
                            </span>
                            <div className='w-full flex items-center justify-center'>
                                {emailVerifyResult.success === true &&
                                    <p className="text-lg text-center">
                                        {language.includes("tr") ?
                                            "E-posta adresiniz başarılı bir şekilde onaylandı" :
                                            "Your email address has been successfully confirmed"}
                                    </p>
                                    ||
                                    (emailVerifyResult.userExist ?
                                        <p className="text-lg text-center">
                                            {language.includes("tr") ?
                                                "E-posta adresiniz onaylanırken bir hata ile oluştu" :
                                                "An error occurred while confirming your email address"}
                                        </p>
                                        :
                                        <p className="text-lg text-center">
                                            {language.includes("tr") ?
                                                "E-posta adresinizin onaylanması için gönderilen bilgiler yanlış gönderildiği için E-posta adresiniz onaylanamadı" :
                                                "Your email address could not be confirmed because the information sent to confirm your email address was sent incorrectly"}
                                        </p>
                                    )}
                            </div>
                        </div>)
                        :
                        <CustomLoading
                            type={"hash"}
                            size={24}
                            color={isDarkMode ? "white" : "black"}
                            className={""}
                        />}

                </div>
            </div>
        );
    } else {
        return (
            <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <div className={`flex flex-col space-y-2 m-auto max-w-screen-xl h-full px-4 items-center justify-center`}>
                    <div className={`p-3 flex flex-col space-y-2 rounded-lg ${isDarkMode ? "bg-slate-600" : "bg-gray-100"}`}>
                        <p className='font-semibold'>
                            {language.includes("tr") ? "Sayfa Bulunamadı" : "Page Not Found"}
                        </p>

                        <p className="text-lg text-center">
                            {language.includes("tr") ? "Girmiş olduğunuz sayfa mevcut değil" : "The page you entered does not exist"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default EmailVerify;