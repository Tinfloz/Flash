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
export const getUserAndPosts = createAsyncThunk("user/user", async (name, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await userProfService.getUserProfs(name, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

// follow and unfollow users
export const followUnfollowUsers = createAsyncThunk("user/followStatus", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await userProfService.folUnfolUser(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

// export const getLoggedInUser = createAsyncThunk("user/loggedIn", async (params, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;

//     } catch (error) {

//     }
// })

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
            .addCase(getUserAndPosts.pending, state => {
                state.isLoading = true
            })
            .addCase(getUserAndPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.completeUser
                console.log("state.user", state.user)
            })
            .addCase(getUserAndPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.user = [];
                state.message = action.payload
            })
            .addCase(followUnfollowUsers.pending, state => {
                state.isLoading = true;
            })
            .addCase(followUnfollowUsers.fulfilled, (state, action) => {
                let newUser;
                if (state.user.followers.includes(action.payload.userId)) {
                    const newFollowers = state.user.followers.filter(follower => follower !== action.payload.userId);
                    newUser = { ...state.user, followers: newFollowers }
                } else {
                    const newFollowers = [...state.user.followers, action.payload.userId]
                    newUser = { ...state.user, followers: newFollowers }
                }
                state.user = newUser;
                state.isSuccess = true;
                state.isLoading = false;
            })
            .addCase(followUnfollowUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { reset, resetHelpers } = userProfSlice.actions;
export default userProfSlice.reducer;
