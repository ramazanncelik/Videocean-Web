"use client"
import { useAppContext } from '@/contexts/AppContext';
import SubscriptionCard from './SubscriptionCard'

const Subscriptions = ({ toggleMenu }) => {

    const { language, mySubscriptions } = useAppContext();

    if (mySubscriptions.length !== 0) {
        return (
            <ul className="pl-4 space-y-2 overflow-auto max-h-72">
                {mySubscriptions.map(subscription => {
                    return (
                        <SubscriptionCard
                            key={subscription._id}
                            toggleMenu={toggleMenu}
                            subscriptionData={subscription} />
                    )
                })}
            </ul>
        );
    } else {
        return (
            <div className="p-2 ml-4 rounded-lg bg-blue-100 text-blue-700">
                {language.includes("tr") ? "Abonelik bulunamadı" : "Subscription not found"}
            </div>
        );
    }
}

export default Subscriptions;