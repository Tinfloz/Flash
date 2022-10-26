import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {
    posts: [],
    userName: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

export const getAllLoggedPosts = createAsyncThunk("post/getPosts", async (param, thunkAPI) => {
    console.log("get posts api called")
    try {
        const token = thunkAPI.getState().auth.user.token;
        console.log("token", token)
        return await postService.getAllPosts(token);
    } catch (error) {
        console.error(error)
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        reset: state => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = ""
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getAllLoggedPosts.pending, state => {
                state.isLoading = true;
            })
            .addCase(getAllLoggedPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.posts = action.payload.posts;
                state.userName = action.payload.userName;
                console.log(state.posts)
            })
            .addCase(getAllLoggedPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload
                console.log("======>", state.message)
            })
    }
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;