import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    myVideos: [],
}

const myVideos = createSlice({
    name: 'myVideos',
    initialState,
    reducers: {
        setMyVideos: (state, action) => {
            state.myVideos = action.payload
        },
    }
});

export const { setMyVideos } = myVideos.actions
export default myVideos.reducer;