import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    myLikedVideos: [],
}

const myLikedVideos = createSlice({
    name: 'myLikedVideos',
    initialState,
    reducers: {
        setMyLikedVideos: (state, action) => {
            state.myLikedVideos = action.payload
        },
    }
});

export const { setMyLikedVideos } = myLikedVideos.actions
export default myLikedVideos.reducer;