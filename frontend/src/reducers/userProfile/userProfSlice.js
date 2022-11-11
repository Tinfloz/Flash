import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userProfService from "./userProfService";

const initialState = {
    user: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

// searhed profiles
export const getUserProfPosts = createAsyncThunk("userProf/getProfPosts", async (userName, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await userProfService.getUserProfs(userName, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

// follow and unfollow users
export const followAndUnfollowUser = createAsyncThunk("userProf/follow", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await userProfService.folUnfolUsers(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

const userProfSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reset: state => initialState,
        resetHelpers: state => ({
            ...initialState,
            user: state.user
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getUserProfPosts.pending, state => {
                state.isLoading = true;
            })
            .addCase(getUserProfPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(getUserProfPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = []
            })
            .addCase(followAndUnfollowUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(followAndUnfollowUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                let newUser;
                let newFollowers;
                if (state.user.followers.includes(action.payload.userId)) {
                    newFollowers = state.user.followers.filter(follower => follower !== action.payload.userId)
                    newUser = { ...state.user, followers: newFollowers }
                } else {
                    newFollowers = [...state.user.followers, action.payload.userId]
                    newUser = { ...state.user, followers: newFollowers }
                }
                state.user = newUser;
            })
            .addCase(followAndUnfollowUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { reset, resetHelpers } = userProfSlice.actions;
export default userProfSlice.reducer;
