import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { acceptFollowRequest, getAllFollowRequests, rejectFollowRequest } from "./followRequestService";

const initialState = {
    followRequests: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

export const getFollowRequests = createAsyncThunk("requests/get", async (param, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await getAllFollowRequests(token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const followAccept = createAsyncThunk("request/accept", async (name, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await acceptFollowRequest(name, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const followReject = createAsyncThunk("request/reject", async (name, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await rejectFollowRequest(name, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

const requestSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        reset: state => initialState,
        resetHelpers: state => ({
            ...initialState,
            followRequests: state.followRequests
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getFollowRequests.pending, state => {
                state.isLoading = true;
            })
            .addCase(getFollowRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.followRequests = action.payload.requests;
            })
            .addCase(getFollowRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.followRequests = [];
                state.message = action.payload;
            })
            .addCase(followAccept.pending, state => {
                state.isLoading = true;
            })
            .addCase(followAccept.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(followAccept.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(followReject.pending, state => {
                state.isLoading = true;
            })
            .addCase(followReject.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(followReject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { reset, resetHelpers } = requestSlice.actions;
export default requestSlice.reducer