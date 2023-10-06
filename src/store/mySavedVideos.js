import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mySavedVideos: [],
}

const mySavedVideos = createSlice({
    name: 'mySavedVideos',
    initialState,
    reducers: {
        setMySavedVideos: (state, action) => {
            state.mySavedVideos = action.payload
        },
    }
});

export const { setMySavedVideos } = mySavedVideos.actions
export default mySavedVideos.reducer;