import { configureStore } from '@reduxjs/toolkit'
import auth from './auth'
import myVideos from './myVideos'
import modal from './modal'
import mySubscriptions from './mySubscriptions'
import mySavedVideos from './mySavedVideos'
import myLikedVideos from './myLikedVideos'

const store = configureStore({
    reducer: {
        auth,
        myVideos,
        modal,
        mySubscriptions,
        mySavedVideos,
        myLikedVideos
    }
})

export default store;