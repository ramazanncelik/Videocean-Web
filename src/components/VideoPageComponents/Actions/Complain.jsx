import { useAppContext } from '@/contexts/AppContext';
import store from '@/store';
import { openModal } from '@/store/modal';
import { Menu } from '@headlessui/react'
import { FaRegFlag } from 'react-icons/fa';

const Complain = ({ videoId }) => {

    const { language } = useAppContext();

    const complaintFormModalOpen = async () => {

        store.dispatch(openModal({
            name: 'complaint-form-modal',
            data: { videoId: videoId }
        }));

    }

    return (
        <Menu.Item>
            {() => (
                <button
                    onClick={() => complaintFormModalOpen()}
                    className={`hover:bg-gray-200 text-black group flex flex-row space-x-1 w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                    <FaRegFlag size={16} color='black' />

                    <span className={`flex flex-1`}>
                        {language.includes("tr") ? "Bildir" : "Report"}
                    </span>
                </button>
            )}
        </Menu.Item>
    );
}

export default Complain;