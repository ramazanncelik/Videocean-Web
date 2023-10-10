import { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FaEllipsisH } from 'react-icons/fa'
import Save from './Save'
import Complain from './Complain'
import Delete from './Delete'
import { serverUrl } from '@/utils/utils';

export default function ActionsDropDown({ videoId, videoInfo, comments }) {

  const { isDarkMode, authToken, user } = useAppContext();
  const [saveId, setSaveId] = useState(null);

  const handleSaveCheck = async () => {
    await setTimeout(async () => {
      const url = serverUrl + `savedvideo/check/${user._id}/${videoId}`
      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
      });

      if (result) {
        const save = await result.json();
        if (save.success) {
          await setSaveId(save.result._id);
        } else {
          await setSaveId(null);
        }
      }
    }, 100);
  }

  const createSave = async () => {

    const url = serverUrl + `savedvideo`;
    const body = {
      UserId: user._id,
      VideoId: videoId,
      Date: new Date()
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

  const deleteSave = async () => {
    const url = serverUrl + `savedvideo/${saveId}`;
    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
    });
  }

  useEffect(() => {
    handleSaveCheck();
  }, []);

  useEffect(() => {
    handleSaveCheck();
  }, [videoId]);

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className={`p-3 flex items-center justify-center rounded-full ${isDarkMode ? "bg-slate-600 hover:bg-slate-500" : "bg-gray-100 hover:bg-gray-200"}`}>
            <FaEllipsisH size={16} color={isDarkMode ? "white" : "black"} />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 flex flex-col space-y-1">
              <Save
                saveId={saveId}
                handleSaveCheck={handleSaveCheck}
                createSave={createSave}
                deleteSave={deleteSave}
              />
              {videoInfo.OwnerId !== user._id &&
                <Complain videoId={videoId} />}
              {videoInfo.OwnerId === user._id &&
                <Delete videoId={videoId} comments={comments} />}
            </div>
          </Menu.Items>
        </Transition>
      </Menu >
    </div >
  )
}
