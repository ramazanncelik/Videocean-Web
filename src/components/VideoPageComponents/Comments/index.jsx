"use client"

import CustomLoading from "@/components/CustomLoading";
import { useAppContext } from "@/contexts/AppContext";
import CommentCard from '@/components/CommentCard/index'

const Comments = ({ comments,getComments }) => {

    const { language, isDarkMode } = useAppContext();

    if (comments) {
        return (
            <div className="w-full h-max flex flex-col space-y-3">
                {comments.length !== 0 ?
                (comments.map(comment=>{
                    return(
                        <CommentCard key={comment._id} commentId={comment._id} getComments={getComments} />
                    )
                }))
            :
                    <div className="w-full p-3 rounded-lg bg-blue-100 text-blue-700">
                        {language.includes("tr") ? "Henüz Yorum Yapılmamış." : "No Comments Yet."}
                    </div>}
            </div>
        );
    } else {
        return (
            <CustomLoading
                className={`w-full flex items-center justify-center p-3 rounded-lg border ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}
                type={"hash"}
                color={isDarkMode ? "white" : "black"}
                size={24}
            />
        )
    }
}

export default Comments;