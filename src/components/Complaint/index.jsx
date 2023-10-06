"use client"

import { useAppContext } from "@/contexts/AppContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { reportTitleList } from '@/utils/reportTitleList'
import DeleteVideo from './Actions/DeleteVideo'
import DeleteComplaint from './Actions/DeleteComplaint'

const Complaint = ({ no, complaintData, getComplaints }) => {

    const { isDarkMode, language } = useAppContext();
    const [title, setTitle] = useState({ value: "", tr: "", en: "" });

    const editTitle = async () => {
        const data = await reportTitleList.find(item => item.value === complaintData.Title);
        await setTitle(data);
    }

    useEffect(() => {

        editTitle();

    }, [complaintData])

    return (
        <div className={`w-full flex flex-row space-x-4 items-center border-b ${isDarkMode ? "border-slate-500" : "border-gray-200"}`}>
            <Link href={`/video/${complaintData.VideoId}`} scope="row" className="w-24 px-6 py-4 font-semibold">
                {no}
            </Link>
            <Link href={`/video/${complaintData.VideoId}`} className="flex-1 py-4">
                {language.includes("tr") ? title.tr : title.en}
            </Link>
            <Link href={`/video/${complaintData.VideoId}`} className="flex-1 py-4">{complaintData.Description}</Link>
            <span className="flex-1 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-1">
                <DeleteVideo videoId={complaintData.VideoId} getComplaints={getComplaints} />
                <DeleteComplaint complaintId={complaintData._id} getComplaints={getComplaints} />
            </span>
        </div>
    );
}

export default Complaint;