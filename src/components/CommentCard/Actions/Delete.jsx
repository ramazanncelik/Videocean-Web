import CustomLoading from "@/components/CustomLoading";
import { useAppContext } from "@/contexts/AppContext";
import { serverUrl } from "@/utils/utils";
import { useState } from "react";

const DeleteComment = ({ commentId, getComments }) => {

    const { authToken, language } = useAppContext();
    const [loading, setLoading] = useState(false);

    const deleteComment = async () => {
        await setLoading(true);

        const url = serverUrl + `comment/${commentId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });

        await getComments();
        await setLoading(false);
    }

    if (!loading) {
        return (
            <span onClick={() => deleteComment()} className='flex items-center justify-end text-red-500 cursor-pointer select-none'>
                {language.includes("tr") ? "Sil" : "Delete"}
            </span>
        );
    } else {
        return (
            <CustomLoading
                className='w-12 items-center justify-end text-red-500'
                type={"pacman"}
                color={"red"}
                size={8}
            />
        );
    }
}

export default DeleteComment;