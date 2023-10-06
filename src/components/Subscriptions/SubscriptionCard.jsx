"use client"
import { useAppContext } from "@/contexts/AppContext";
import { serverUrl } from "@/utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import CustomLoading from "../CustomLoading";
import Image from "next/image";

const SubscriptionCard = ({ toggleMenu, subscriptionData }) => {

    const { authToken, isDarkMode } = useAppContext();
    const [userInfo, setUserInfo] = useState(null);

    const getUserInfo = async () => {
        const url = serverUrl + `user/${subscriptionData.To}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const user = await result.json();
            await setUserInfo({
                _id: user._id,
                NickName: user.NickName,
                ImageUrl: user.ImageUrl,
            });
        }
    }

    useEffect(() => {
        if (subscriptionData) {
            getUserInfo();
        }
    }, [subscriptionData]);


    if (userInfo) {
        return (
            <li>
                <Link onClick={() => toggleMenu()} href={`/user/${userInfo._id}`} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100"}`}>
                    <Image
                        width={24}
                        height={24}
                        src={userInfo.ImageUrl}
                        className='rounded-full'
                        alt={userInfo.NickName}
                    />
                    <span>{userInfo.NickName}</span>
                </Link>
            </li>
        );
    } else {
        return (
            <li>
                <CustomLoading
                    type={"hash"}
                    size={16}
                    color={isDarkMode ? "white" : "black"}
                    className={`p-2 rounded-lg flex flex-row items-center justify-center space-x-4 border ${isDarkMode ? "border-slate-400" : "border-gray-400"}`}
                />
            </li>
        );
    }
}

export default SubscriptionCard;