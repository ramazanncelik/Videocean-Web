"use client"
import Link from 'next/link'
import { useAppContext } from '@/contexts/AppContext'
import { useState } from 'react'
import { usePathname } from 'next/navigation';
import { FaHome, FaUser, FaSignInAlt, FaUserPlus, FaSun, FaMoon, FaUserEdit, FaRegBookmark, FaRegThumbsUp, FaFireAlt, FaMusic, FaGamepad, FaTrophy, FaRegFlag, FaMailBulk } from 'react-icons/fa'
import { MdClose, MdLockReset, MdLogout, MdMail } from 'react-icons/md'
import { useSelector } from 'react-redux';
import store from "@/store";
import { openModal } from "@/store/modal";
import Modal from "@/components/Modal";
import Subscriptions from "@/components/Subscriptions";
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import { serverUrl } from '@/utils/utils';

const Navbar = () => {

    const { language, isDarkMode, changeThemeMode, changeAuthToken, user, mySubscriptions } = useAppContext();
    const { open, data } = useSelector(state => state.modal)
    const router = useRouter();
    const [menuIsVisible, setMenuIsVisible] = useState(false);
    const [profileLinkMenuIsVisible, setProfileLinkMenuIsVisible] = useState(false)
    const [subscriptionsListIsVisible, setSubscriptionsListIsVisible] = useState(false)
    const [adminPanelMenuIsVisible, setAdminPanelIsVisible] = useState(false)
    const [searchValue, setSearchValue] = useState("");

    const pathname = usePathname();

    const toggleMenu = () => {
        setMenuIsVisible(!menuIsVisible);
        setProfileLinkMenuIsVisible(false);
    };

    const loginModalOpen = async () => {
        store.dispatch(openModal({
            name: 'login-modal',
        }));
    }

    const signupModalOpen = async () => {
        store.dispatch(openModal({
            name: 'signup-modal',
        }));
    }

    const resetPasswordModalOpen = async () => {
        store.dispatch(openModal({
            name: 'resetpassword-modal',
        }));
    }

    const signout = async () => {
        await changeAuthToken(null);
    }

    const handleSearch = async (e) => {
        if (e.key === "Enter" && searchValue !== "") {
            await router.replace(`/search?searchValue=${searchValue}`);
        }
    }

    const getEmailVerifyMail = async () => {
        const url = serverUrl + `auth/getEmailVerifyMail`;
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: user.Email,
                subject: language.includes("tr") ? "E-posta Onaylama - Videocean" : "Email Verify - Videocean",
                text: language.includes("tr") ? "E-posta adresinizi doğrulamak için aşağıdaki bağlantıya tıklayabilirsiniz" : "You can click on the link below to verify your email address",
            })
        });

        if (result) {
            await toast.success(language.includes("tr") ?
                "Onaylama Maili E-posta adresinize iletildi"
                :
                "Confirmation mail sent to your e-mail address")
        } else {
            await toast.success(language.includes("tr") ?
                "Onaylama Maili E-posta adresinize iletilirken bir hata oluştu. Lütfen tekrar deneyiniz"
                :
                "There was an error sending the Confirmation Mail to your e-mail address. Please try again")
        }
    }

    return (
        <nav className={`w-full fixed z-10 border-b select-none ${isDarkMode ? "bg-slate-700 border-slate-400" : "bg-white border-slate-300"}`}>

            {open && <Modal name={open} data={data} />}

            <div className="w-full flex flex-wrap items-center justify-between mx-auto p-2">
                <div className='flex flex-1 flex-row space-x-5 items-center'>
                    <button onClick={() => toggleMenu()} className={`inline-flex items-center p-2 rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? "text-slate-300 hover:bg-slate-600 focus:ring-slate-600" : "text-black hover:bg-gray-100 focus:ring-slate-200"}`}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    </button>

                    <span className={`text-xl items-center font-semibold ml-2 ${isDarkMode ? "text-white" : "text-black"}`}>Videocean</span>
                </div>

                <div className='flex-1 items-center justify-center'>
                    <input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        onKeyDown={e => handleSearch(e)}
                        className={`w-full py-1 px-3 rounded-lg border ${isDarkMode ? "bg-slate-700 border-slate-400 text-white" : "bg-white border-slate-300 text-black"}`}
                        placeholder={language == "tr" ? "Ara" : "Search"}
                    />
                </div>

                <div className='flex flex-1 items-center justify-end'>
                    <button onClick={() => changeThemeMode()} className={`p-3 rounded-lg flex flex-row items-center space-x-4 ${isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100"}`}>
                        {isDarkMode ?
                            <FaMoon size={16} />
                            :
                            <FaSun size={16} />}
                    </button>
                </div>

                {menuIsVisible &&
                    <div className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto w-64 border-r flex flex-col ${isDarkMode ? "bg-slate-700 border-slate-400" : "bg-white border-slate-300"}`}>
                        <div className={`w-full flex flex-row items-center pb-1 mb-1 px-1 border-b ${isDarkMode ? "border-slate-400" : "border-slate-300"}`}>
                            <div className={`flex flex-1 items-center ${isDarkMode ? "text-white" : "text-black"}`}>
                                {language.includes("tr") ? "Menü" : "Menu"}
                            </div>

                            <button onClick={() => toggleMenu()} className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-slate-500" : "hover:bg-gray-100"}`}>
                                <MdClose size={20} color={isDarkMode ? "white" : "black"} />
                            </button>
                        </div>

                        {user ?
                            <ul className='w-full flex flex-col space-y-1'>
                                <li>
                                    <Link onClick={() => setMenuIsVisible(false)} href={"/"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${pathname === "/" && "text-orange-500 hover:bg-orange-500 hover:text-white" || (isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100")}`}>
                                        <FaHome size={20} />
                                        <span>{language.includes("tr") ? "Ev" : "Home"}</span>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={() => setProfileLinkMenuIsVisible(!profileLinkMenuIsVisible)} className={`w-full rounded-lg ${(pathname === "/profile" || pathname === "/profileEdit") && "hover:bg-orange-500" || (isDarkMode ? "hover:bg-slate-600" : "hover:bg-gray-100")}`}>
                                        <div className={`flex flex-row items-center w-full p-2 ${(pathname === "/profile" || pathname === "/profileEdit") && "text-orange-500 hover:text-white" || (isDarkMode ? "text-white" : "text-black")}`}>
                                            <span className='flex flex-1 flex-row space-x-4'>
                                                <Image
                                                    width={20}
                                                    height={20}
                                                    src={user.ImageUrl}
                                                    className='rounded-full'
                                                    alt={"userImage"}
                                                />
                                                <span>
                                                    {user.NickName}
                                                </span>
                                            </span>
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                        </div>
                                    </button>
                                    {profileLinkMenuIsVisible &&
                                        <ul className="pl-4 space-y-2">
                                            <li>
                                                <Link onClick={() => toggleMenu()} href={"/profile"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100"}`}>
                                                    <FaUser size={20} />
                                                    <span>{language.includes("tr") ? "Profil" : "Profile"}</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link onClick={() => toggleMenu()} href={"/profileEdit"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100"}`}>
                                                    <FaUserEdit size={20} />
                                                    <span>{language.includes("tr") ? "Profili Düzenle" : "Profile Edit"}</span>
                                                </Link>
                                            </li>
                                            {user.EmailVerify !== true &&
                                                <li>
                                                    <div onClick={() => getEmailVerifyMail()} className={`p-2 rounded-lg flex flex-row items-center space-x-4 cursor-pointer ${isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100"}`}>
                                                        <MdMail size={20} />
                                                        <span>{language.includes("tr") ? "E-mail Onayla" : "E-mail Verify"}</span>
                                                    </div>
                                                </li>}
                                            <li>
                                                <button onClick={() => { signout(); toggleMenu() }} href={"/profileEdit"} className={`w-full p-2 rounded-lg flex flex-row items-center space-x-4 ${isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100"}`}>
                                                    <MdLogout size={20} />
                                                    <span>{language.includes("tr") ? "Çıkış Yap" : "Logout"}</span>
                                                </button>
                                            </li>
                                        </ul>}
                                </li>
                                <li>
                                    <button onClick={() => setSubscriptionsListIsVisible(!subscriptionsListIsVisible)} className={`w-full mb-1 rounded-lg ${isDarkMode ? "hover:bg-slate-600" : "hover:bg-gray-100"}`}>
                                        <div className={`flex flex-row items-center w-full p-2 ${isDarkMode ? "text-white" : "text-black"}`}>
                                            <span className='flex flex-1 flex-row space-x-1'>
                                                <span>{language.includes("tr") ? "Abonelikler" : "Subscriptions"}</span>
                                                {mySubscriptions.length !== 0 &&
                                                    <span>
                                                        - {mySubscriptions.length}
                                                    </span>}
                                            </span>
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                        </div>
                                    </button>
                                    {subscriptionsListIsVisible &&
                                        <Subscriptions toggleMenu={toggleMenu} />}
                                </li>
                                {user.Role !== "User" &&
                                    <li>
                                        <button onClick={() => setAdminPanelIsVisible(!adminPanelMenuIsVisible)} className={`w-full mb-1 rounded-lg ${isDarkMode ? "hover:bg-slate-600" : "hover:bg-gray-100"}`}>
                                            <div className={`flex flex-row items-center w-full p-2 ${isDarkMode ? "text-white" : "text-black"}`}>
                                                <span className='flex-1 text-left'>
                                                    {language.includes("tr") ? "Admin Paneli" : "Admin Panel"}
                                                </span>
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                            </div>
                                        </button>
                                        {adminPanelMenuIsVisible &&
                                            <ul className="pl-4 space-y-2">
                                                <li>
                                                    <Link onClick={() => toggleMenu()} href={"/admin/complaints"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100"}`}>
                                                        <FaRegFlag size={20} />
                                                        <span>{language.includes("tr") ? "Şikayetler" : "Complaints"}</span>
                                                    </Link>
                                                </li>
                                            </ul>}
                                    </li>}
                                <li>
                                    <ul className={`w-full flex flex-col space-y-1 py-2 border-t ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}>
                                        <li>
                                            <Link onClick={() => setMenuIsVisible(false)} href={"/savedvideos"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${pathname === "/savedvideos" && "text-orange-500 hover:bg-orange-500 hover:text-white" || (isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100")}`}>
                                                <FaRegBookmark size={20} />
                                                <span>{language.includes("tr") ? "Kaydedilen Videolar" : "Saved Videos"}</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link onClick={() => setMenuIsVisible(false)} href={"/likedvideos"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${pathname === "/likedvideos" && "text-orange-500 hover:bg-orange-500 hover:text-white" || (isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100")}`}>
                                                <FaRegThumbsUp size={20} />
                                                <span>{language.includes("tr") ? "Beğenilen Videolar" : "Liked Videos"}</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            :
                            <ul className='w-full flex flex-col space-y-2'>
                                <li>
                                    <Link onClick={() => setMenuIsVisible(false)} href={"/"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${pathname === "/" && "text-orange-500 hover:bg-orange-500 hover:text-white" || (isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100")}`}>
                                        <FaHome size={20} />
                                        <span>{language.includes("tr") ? "Ev" : "Home"}</span>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={() => loginModalOpen()} className={`w-full p-2 rounded-lg flex flex-row items-center space-x-4 ${isDarkMode ? "text-white hover:bg-slate-500" : "text-black hover:bg-gray-100"}`}>
                                        <FaSignInAlt size={20} />
                                        <span>{language.includes("tr") ? "Giriş Yap" : "Login"}</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => signupModalOpen()} className={`w-full p-2 rounded-lg flex flex-row items-center space-x-4 ${isDarkMode ? "text-white hover:bg-slate-500" : "text-black hover:bg-gray-100"}`}>
                                        <FaUserPlus size={20} />
                                        <span>{language.includes("tr") ? "Kayıt Ol" : "Sign Up"}</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => resetPasswordModalOpen()} className={`w-full p-2 rounded-lg flex flex-row items-center space-x-4 ${isDarkMode ? "text-white hover:bg-slate-500" : "text-black hover:bg-gray-100"}`}>
                                        <MdLockReset size={20} />
                                        <span>{language.includes("tr") ? "Şifre Sıfırla" : "Reset Password"}</span>
                                    </button>
                                </li>
                            </ul>}
                        <ul className={`w-full flex flex-col space-y-1 mt-1 py-2 border-t ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}>
                            <p className={`w-full pl-2 font-semibold ${isDarkMode ? "text-white" : "text-black"}`}>
                                {language.includes("tr") ? "Keşfet" : "Explore"}
                            </p>
                            <li>
                                <Link onClick={() => setMenuIsVisible(false)} href={"/explore/trends"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${pathname === "/explore/trends" && "text-orange-500 hover:bg-orange-500 hover:text-white" || (isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100")}`}>
                                    <FaFireAlt size={20} />
                                    <span>{language.includes("tr") ? "Trendler" : "Trends"}</span>
                                </Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuIsVisible(false)} href={"/explore/music"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${pathname === "/explore/music" && "text-orange-500 hover:bg-orange-500 hover:text-white" || (isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100")}`}>
                                    <FaMusic size={20} />
                                    <span>{language.includes("tr") ? "Müzik" : "Music"}</span>
                                </Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuIsVisible(false)} href={"/explore/game"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${pathname === "/explore/game" && "text-orange-500 hover:bg-orange-500 hover:text-white" || (isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100")}`}>
                                    <FaGamepad size={20} />
                                    <span>{language.includes("tr") ? "Oyun" : "Game"}</span>
                                </Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuIsVisible(false)} href={"/explore/sport"} className={`p-2 rounded-lg flex flex-row items-center space-x-4 ${pathname === "/explore/sport" && "text-orange-500 hover:bg-orange-500 hover:text-white" || (isDarkMode ? "text-white hover:bg-slate-600" : "text-black hover:bg-gray-100")}`}>
                                    <FaTrophy size={20} />
                                    <span>{language.includes("tr") ? "Spor" : "Sport"}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>}
            </ div>

        </nav>
    );
}

export default Navbar;