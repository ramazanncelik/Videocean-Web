"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { serverUrl } from "@/utils/utils";
import CustomLoading from "@/components/CustomLoading";

const Subscription = ({ userData }) => {

    const { user, authToken, isDarkMode, language, getCurrentUserSubscriptions } = useAppContext();
    const [subscriptionId, setSubscriptionId] = useState(null);
    const [loading, setLoading] = useState(false);

    const subscriptionCheck = async () => {
        const url = serverUrl + `subscription/subscriptionCheck/${user._id}/${userData._id}`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const subscriptionResult = await result.json();
            if (subscriptionResult.success) {
                setSubscriptionId(subscriptionResult.subscription_id)
            } else {
                setSubscriptionId(null);
            }
        }
    }

    const handleSubmitSubscribe = async () => {
        await setLoading(true);
        if (subscriptionId) {
            await deleteSubscription();
        } else {
            await createSubscription();
        }
        await getCurrentUserSubscriptions(user._id);
        await subscriptionCheck();
        await setLoading(false);
    }

    const createSubscription = async () => {
        const url = serverUrl + `subscription`;
        const body = {
            From: user._id,
            To: userData._id
        };
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(body)
        });
    }

    const deleteSubscription = async () => {
        const url = serverUrl + `subscription/${subscriptionId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
    }

    useEffect(() => {

        if (userData && user) {
            subscriptionCheck();
        }

    }, [userData, user]);

    return (
        <div className="flex items-center justify-center">
            {!loading ?
                <button onClick={() => handleSubmitSubscribe()} className={`h-max px-3 py-1 rounded-lg font-semibold ${isDarkMode ? "text-white bg-slate-600 hover:bg-slate-500" : "text-black bg-gray-100 hover:bg-gray-200"}`}>
                    {!subscriptionId &&
                        language.includes("tr") ? "Abone Ol" : "Subscribe"
                            ||
                            language.includes("tr") ? "Abonelikten Çık" : "Unsubscribe"}
                </button>
                :
                <CustomLoading
                    type={"pacman"}
                    color={isDarkMode ? "white" : "black"}
                    size={8}
                    className={`h-max px-12 py-2 rounded-lg ${isDarkMode ? "bg-slate-600" : "bg-gray-100"}`} />}
        </div>
    );
}

export default Subscription;