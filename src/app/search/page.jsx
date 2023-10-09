"use client"
import { useAppContext } from "@/contexts/AppContext";
import { serverUrl } from "@/utils/utils";
import { useEffect, useState } from "react";
import User from '@/components/SearchPageComponents/User'
import Video from '@/components/SearchPageComponents/Video'

const Search = ({ searchParams }) => {

    const { user, language } = useAppContext();
    const { isDarkMode } = useAppContext();
    const [searchList, setSearchList] = useState([]);

    const getUsers = async () => {
        const url = serverUrl + `user/searchUser/${searchParams.searchValue}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (result) {
            const resultJson = await result.json();
            if (resultJson.success) {
                const users = resultJson.result;
                if (users.length !== 0) {
                    const list = [];
                    for (let i = 0; i < users.length; i++) {
                        if (users[i]._id !== user._id) {
                            await list.push({
                                type: "user",
                                data: {
                                    ...users[i]
                                }
                            });
                        }
                        if (i + 1 === users.length) {
                            await getVideos(list);
                        }
                    }
                } else {
                    await getVideos([]);
                }
            }
        }

    }

    const getVideos = async (users) => {
        const url = serverUrl + `video/searchVideo/${searchParams.searchValue}`
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (result) {
            const resultJson = await result.json();
            if (resultJson.success) {
                const videos = resultJson.result;
                if (videos.length !== 0) {
                    const list = users;
                    for (let i = 0; i < videos.length; i++) {
                        await list.push({
                            type: "video",
                            data: {
                                ...videos[i]
                            }
                        });
                        if (i + 1 === videos.length) {
                            await setSearchList(list);
                        }
                    }
                } else {
                    await setSearchList(users);
                }
            }
        }
    }

    useEffect(() => {
        if (searchParams.searchValue) {
            getUsers();
        }
    }, [searchParams]);

    useEffect(() => {
        if (searchParams) {
            if (searchParams.searchValue) {
                getUsers();
            }
        }
    }, []);

    return (
        <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
            <div className={`flex flex-col space-y-4 m-auto max-w-screen-xl px-4 py-2`}>
                {searchList.length !== 0 &&
                    (searchList.map(searchItem => {
                        return (
                            searchItem.type === "user" ?
                                <User key={searchItem.data._id} userData={searchItem.data} />
                                :
                                <Video key={searchItem.data._id} videoData={searchItem.data} />
                        )
                    }))
                    ||
                    <div className="w-full p-3 bg-blue-100 text-blue-700 font-bold rounded-lg">
                        {language.includes("tr") ? `Girdiğiniz kelimeyi içeren bir Video veya Kullanıcı bulunamadı.` : `No Video or User containing the word you entered was found.`}
                    </div>}
            </div>
        </div>
    );
}

export default Search;