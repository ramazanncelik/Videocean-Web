"use client"
import { useAppContext } from '@/contexts/AppContext'

const NotFound = () => {

    const { isDarkMode, language } = useAppContext();

    return (
        <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
            <div className={`flex flex-col space-y-2 m-auto max-w-screen-xl h-full px-4 items-center justify-center`}>
                <div className={`p-3 flex flex-col space-y-2 rounded-lg ${isDarkMode ? "bg-slate-600" : "bg-gray-100"}`}>
                    <p className='font-semibold'>
                        {language.includes("tr") ? "Sayfa Bulunamadı" : "Page Not Found"}
                    </p>

                    <p>
                        {language.includes("tr") ? "Girmiş olduğunuz sayfa mevcut değil" : "The page you entered does not exist"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
