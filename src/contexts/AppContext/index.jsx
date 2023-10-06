"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import jwtdecode from 'jwt-decode'
import { serverUrl, setUserData, setUserLikedVideosData, setUserSavedVideosData, setUserSubsctiptionsData, setUserVideosData } from '@/utils/utils';
import store from "@/store";
import { logout } from "@/store/auth";
import { useSelector } from 'react-redux';

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [language, setLanguage] = useState('tr');
    const [authToken, setAuthToken] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const { myVideos } = useSelector((state) => state.myVideos);
    const { mySubscriptions } = useSelector((state) => state.mySubscriptions);
    const { mySavedVideos } = useSelector((state) => state.mySavedVideos);
    const { myLikedVideos } = useSelector((state) => state.myLikedVideos);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLanguage(navigator.language);
            const storedDarkMode = localStorage.getItem('isDarkMode');
            setIsDarkMode(storedDarkMode ? JSON.parse(storedDarkMode) : false);
            const storedAuthToken = localStorage.getItem('vidify-authToken');
            setAuthToken(storedAuthToken ? JSON.parse(storedAuthToken) : null);
        }
    }, []);

    useEffect(() => {
        if (authToken) {
            getCurrentUser();
        } else {
            store.dispatch(logout());
        }
    }, [authToken]);

    const getCurrentUser = async () => {
        const userId = (await jwtdecode(authToken)).user._id;

        if (userId) {
            const url = serverUrl + `user/${userId}`
            const result = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
            });

            if (result) {
                const userInfo = await result.json();
                if (userInfo) {
                    await setUserData({
                        _id: userInfo._id,
                        Email: userInfo.Email,
                        NickName: userInfo.NickName,
                        FullName: userInfo.FullName,
                        ImageUrl: userInfo.ImageUrl,
                        Biography: userInfo.Biography,
                        ConfirmationCode: userInfo.ConfirmationCode,
                        EmailVerify: userInfo.EmailVerify,
                        SubscriberCount: userInfo.SubscriberCount,
                        VideoCount: userInfo.VideoCount,
                        Role: userInfo.Role
                    });
                    await getCurrentUserVideos(userInfo._id);
                    await getCurrentUserSubscriptions(userInfo._id);
                    await getCurrentUserSavedVideos(userInfo._id);
                    await getCurrentUserLikedVideos(userInfo._id);
                }
            }
        }
    }

    const getCurrentUserVideos = async (user_id) => {
        const url = serverUrl + `video/${user_id}/userVideos`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const myVideos = await result.json();
            if (myVideos) {
                const list = myVideos.reverse();
                await setUserVideosData(list);
            } else {
                await setUserVideosData([]);
            }
        }
    }

    const getCurrentUserSavedVideos = async (user_id) => {
        const url = serverUrl + `savedvideo/all/${user_id}`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const mySavedVideos = await result.json();
            if (mySavedVideos) {
                await setUserSavedVideosData(mySavedVideos);
            } else {
                await setUserSavedVideosData([]);
            }
        }
    }

    const getCurrentUserLikedVideos = async (user_id) => {
        const url = serverUrl + `like_dislike/getLikedVideos/${user_id}`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const myLikedVideos = await result.json();
            if (myLikedVideos) {
                await setUserLikedVideosData(myLikedVideos);
            } else {
                await setUserLikedVideosData([]);
            }
        }
    }

    const getCurrentUserSubscriptions = async (user_id) => {
        const url = serverUrl + `subscription/userSubscriptions/${user_id}`;
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
        });
        if (result) {
            const mySubscriptions = await result.json();
            if (mySubscriptions) {
                await setUserSubsctiptionsData(mySubscriptions);
            } else {
                await setUserSubsctiptionsData([]);
            }
        }
    }

    const setAndStoreDarkMode = (value) => {
        localStorage.setItem('isDarkMode', JSON.stringify(value));
        setIsDarkMode(value);
    };

    const changeThemeMode = () => {
        const newMode = !isDarkMode;
        setAndStoreDarkMode(newMode);
    };

    const setAndStoreAuthToken = (value) => {
        if (value) {
            localStorage.setItem('vidify-authToken', JSON.stringify(value));
        } else {
            localStorage.removeItem('vidify-authToken');
        }
        setAuthToken(value);
    };

    const changeAuthToken = (value) => {
        setAndStoreAuthToken(value);
    };

    const data = useMemo(
        () => ({
            language,
            isDarkMode,
            authToken,
            user,
            myVideos,
            mySubscriptions,
            mySavedVideos,
            myLikedVideos,
            getCurrentUser,
            getCurrentUserVideos,
            getCurrentUserSubscriptions,
            getCurrentUserSavedVideos,
            getCurrentUserLikedVideos,
            changeThemeMode,
            changeAuthToken
        }),
        [isDarkMode, language, authToken, user, myVideos, mySubscriptions, mySavedVideos, myLikedVideos]
    );

    return (
        <AppContext.Provider value={data}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => {
    const context = useContext(AppContext);
    return context;
}

export { AppContext, AppProvider, useAppContext };