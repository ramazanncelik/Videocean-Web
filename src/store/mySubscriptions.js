import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mySubscriptions: [],
}

const mySubscriptions = createSlice({
    name: 'mySubscriptions',
    initialState,
    reducers: {
        setMySubsCriptions: (state, action) => {
            state.mySubscriptions = action.payload
        },
    }
});

export const { setMySubsCriptions } = mySubscriptions.actions
export default mySubscriptions.reducer;