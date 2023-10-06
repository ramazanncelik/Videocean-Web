"use client"
import { useAppContext } from '@/contexts/AppContext'
import VideoCard from '@/components/VideoCard';

const SavedVideos = () => {

    const { isDarkMode, language, mySavedVideos } = useAppContext();

    return (
        <div className={`mt-14 flex-1 overflow-auto ${isDarkMode ? "bg-slate-700 text-white" : "bg-white text-black"}`}>
            <div className={`flex flex-col space-y-2 m-auto max-w-screen-xl h-full px-4`}>

                <div className={`w-full my-2 p-1 font-semibold border-b ${isDarkMode ? "border-slate-400" : "border-gray-300"}`}>
                    {language.includes("tr") ? "Kaydedilen Videolar" : "Saved Videos"}
                </div>

                {mySavedVideos.length !== 0 ?
                    <div className="w-full pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mySavedVideos.map(savedVideo => {
                            return (
                                <VideoCard
                                    key={savedVideo._id}
                                    videoId={savedVideo.VideoId}
                                    videoData={null} />
                            )
                        })}
                    </div>
                    :
                    <div className="w-full mt-2 p-3 bg-blue-100 text-blue-700 font-bold rounded-lg">
                        {language.includes("tr") ? `Henüz herhangi bir videoyu kaydedilenlere eklemediniz.` : `You haven't added any videos to recorded ones yet.`}
                    </div>}
            </div>
        </div >
    );
}

export default SavedVideos;