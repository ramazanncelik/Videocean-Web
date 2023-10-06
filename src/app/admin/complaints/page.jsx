"use client"
import CustomLoading from '@/components/CustomLoading';
import { useAppContext } from '@/contexts/AppContext'
import { serverUrl } from '@/utils/utils';
import { useEffect, useState } from 'react';
import Complaint from '@/components/Complaint'

const Complaints = () => {

    const { isDarkMode, authToken, user, language } = useAppContext();
    const [complaintsList, setComplaintsList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getComplaints = async () => {
        await setLoading(true);

        const url = serverUrl + `complaint`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const complaints = await result.json();
            if (complaints) {
                await setComplaintsList(complaints);
            } else {
                await setComplaintsList([]);
            }
        }

        await setLoading(false);
    }

    useEffect(() => {

        if (authToken) {
            getComplaints();
        }

    }, [authToken]);

    if (user.Role !== "User") {
        if (!loading) {
            return (
                <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                    <div className={`flex flex-col space-y-2 m-auto max-w-screen-xl px-4 py-2`}>
                        {complaintsList.length !== 0 &&
                            <div className={`w-full text-sm text-left ${isDarkMode ? "text-white" : "text-black"}`}>
                                <div className={`text-xs  uppercase ${isDarkMode ? "bg-slate-600 text-white" : "bg-gray-100 text-black"}`}>
                                    <div className='w-full flex flex-row space-x-4'>
                                        <span scope="col" className="w-24 px-6 py-3 font-bold">
                                            {language.includes("tr") ? "Numara" : "No"}
                                        </span>
                                        <span scope="col" className="flex-1 py-3 font-bold">
                                            {language.includes("tr") ? "Başlık" : "Ttile"}
                                        </span>
                                        <span scope="col" className="flex-1 py-3 font-bold">
                                            {language.includes("tr") ? "Açıklama" : "Description"}
                                        </span>
                                        <span scope="col" className="flex-1 px-6 py-3 font-bold">

                                        </span>
                                    </div>
                                </div>
                                <div>
                                    {complaintsList.map((complaint, index) => {
                                        return (
                                            <Complaint
                                                key={complaint._id}
                                                no={(index + 1)}
                                                complaintData={complaint}
                                                getComplaints={getComplaints} />
                                        )
                                    })}
                                </div>
                            </div>
                            ||
                            <div className="w-full mt-2 p-3 rounded-lg bg-blue-100 text-blue-700">
                                {language.includes("tr") ? "Henüz herhangi bir şikayet bulunmamaktadır." : "There are no complaints yet."}
                            </div>}
                    </div>
                </div>
            );
        } else {
            return (
                <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                    <CustomLoading
                        type={"hash"}
                        color={isDarkMode ? "white" : "black"}
                        size={24}
                        className={`flex items-center justify-center m-auto max-w-screen-xl h-full`}
                    />
                </div>
            )
        }
    } else {
        return (
            <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
                <div className={`flex flex-col space-y-2 m-auto max-w-screen-xl h-full px-4 items-center justify-center`}>
                    <div className={`p-3 flex flex-col space-y-2 rounded-lg ${isDarkMode ? "bg-slate-600" : "bg-gray-100"}`}>
                        <p className='font-semibold'>
                            {language.includes("tr") ? "Sayfa Bulunamadı" : "Page Not Found"}
                        </p>

                        <p>
                            {language.includes("tr") ? "Girmiş olduğunuz sayfa mevcut değil" : "The page you entered does not exist"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

}

export default Complaints;