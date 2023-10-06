"use client"

import { useAppContext } from "@/contexts/AppContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Subscription from './Actions/Subscription'

const User = ({ userData }) => {

    const { language } = useAppContext();
    const [subscriberCount, setSubscriberCount] = useState("");

    const editSubscriberCount = async () => {
        const text = language.includes("tr") ? "abone" : "subscriber";
        if (userData.SubscriberCount >= 1000000000) {
            // Milyarlar
            setSubscriberCount((userData.SubscriberCount / 1000000000).toFixed(0) + 'B ' + text);
        } else if (userData.SubscriberCount >= 1000000) {
            // Milyonlar
            setSubscriberCount((userData.SubscriberCount / 1000000).toFixed(0) + 'M ' + text);
        } else if (userData.SubscriberCount >= 1000) {
            // Binler
            setSubscriberCount((userData.SubscriberCount / 1000).toFixed(0) + 'K ' + text);
        } else {
            if (userData.SubscriberCount === 0) {
                setSubscriberCount(language.includes("tr") ? `${userData.SubscriberCount} abone` : `${userData.SubscriberCount} subscriber`);
            } else {
                setSubscriberCount(userData.SubscriberCount + (language.includes("tr") ? " abone" : " subscriber"));
            }
        }
    }

    useEffect(() => {
        editSubscriberCount();
    }, [userData]);

    return (
        <div className="w-full flex flex-row space-x-5">
            <Link href={`user/${userData._id}`} className="w-80 flex items-center justify-center">
                <Image
                    width={0}
                    height={0}
                    src={userData.ImageUrl}
                    className='w-32 h-32 rounded-full'
                    alt="userImage"
                />
            </Link>

            <Link href={`user/${userData._id}`} className="flex flex-1 flex-col justify-center">
                <p className="font-semibold text-lg mb-2">
                    {userData.NickName}
                </p>

                <p className="text-sm mb-1">{subscriberCount}</p>

                {userData.Biography &&
                    <p className="text-sm">{userData.Biography.length > 150 ?
                        (userData.Biography.slice(0, 150) + "...")
                        :
                        userData.Biography}</p>}
            </Link>
            <Subscription userData={userData} />
        </div>
    );
}

export default User;