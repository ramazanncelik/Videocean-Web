"use client"
import { useAppContext } from "@/contexts/AppContext"
import usageagreement from "@/utils/usageagreement"
import { MdClose } from "react-icons/md";

const UsageAgreements = ({ usageAgreementsToggle }) => {

    const { language } = useAppContext();

    return (
        <div className="w-full md:w-96 h-auto p-2 bg-white rounded-lg flex flex-col space-y-1">

            <div className={`w-full flex flex-row items-center pb-1 px-1 border-b border-gray-300`}>
                <div className={`flex w-full items-center text-black`}>
                    {language.includes("tr") ? "Kullanım Koşulları" : "Usage Agreement"}
                </div>

                <button type="button" onClick={() => usageAgreementsToggle()} className={`p-2 rounded-lg hover:bg-gray-200`}>
                    <MdClose size={20} color="black" />
                </button>
            </div>

            <div className="w-full h-96 p-2 overflow-y-auto">
                {usageagreement.map((item) => {
                    return (
                        <div key={item.id} className="flex flex-row space-x-2">
                            <p className="w-max font-bold text-black">
                                {item.id}.
                            </p>

                            <p className="w-full text-black dark:text-white mb-2">
                                {language.includes("tr") ? item.tr : item.en}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default UsageAgreements