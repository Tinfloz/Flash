import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import searchService from "./searchService";

const initialState = {
    result: [],
    recentSearches: [],
    isLoading: false,
    message: ""
}

export const getAllUsersDisp = createAsyncThunk("search/users", async (query, thunkAPI) => {
    console.log("getAllUsersDisp triggred")
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await searchService.getAllUsers(query, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        reset: state => initialState
    },
    extraReducers: builder => {
        builder
            .addCase(getAllUsersDisp.pending, state => {
                state.isLoading = true;
            })
            .addCase(getAllUsersDisp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.result = action.payload.search;
            })
            .addCase(getAllUsersDisp.rejected, (state, action) => {
                state.isLoading = false;
                state.result = [];
                state.message = action.payload;
            })
    }
});

export const { reset } = searchSlice.actions;
export default searchSlice.reducer;