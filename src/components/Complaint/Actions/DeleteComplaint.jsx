import CustomLoading from '@/components/CustomLoading';
import { useAppContext } from '@/contexts/AppContext';
import { serverUrl } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const DeleteComplaint = ({ complaintId, getComplaints }) => {

    const { isDarkMode, language, authToken } = useAppContext();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            await setLoading(true);

            const url = serverUrl + `complaint/${complaintId}`;
            const result = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
            });
            if (!result.ok) {
                await errorToast();
            } else {
                await showSuccessToast();
                await getComplaints();
            }

            await setLoading(false)
        } catch (error) {
            await errorToast();
        }
    }

    const showSuccessToast = async () => {
        await toast.success(
            language.includes("tr")
                ? "Şikayet Başarılı Bir Şekilde Silindi."
                : "Complaint has been successfully deleted."
        );
    }

    const errorToast = async () => {
        await toast.error(
            language.includes("tr")
                ? "Şikayet Silinirken Bir Hata ile Karşılaşıldı Lütfen Tekrar Deneyiniz."
                : "An Error Was Encountered While Deleting Complaint Please Try Again."
        );
    }

    if (!loading) {
        return (
            <button
                onClick={handleDelete}
                className={`px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600`}>
                {language.includes("tr") ? "Şikayeti Sil" : "Delete Complaint"}
            </button>
        );
    } else {
        return (
            <CustomLoading
                type={"pacman"}
                color={isDarkMode ? "white" : "black"}
                size={8}
                className={`flex items-center justify-center px-6 py-3 rounded-lg border ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}
            />
        )
    }
}

export default DeleteComplaint;
