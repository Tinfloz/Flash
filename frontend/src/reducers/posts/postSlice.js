import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {
    posts: [],
    userName: null,
    likeStatus: null,
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

export const updateLikes = createAsyncThunk("post/like", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await postService.likeUnlike(id, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const upload = createAsyncThunk("post/upload", async (post, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await postService.uploadPosts(post, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const deletePostings = createAsyncThunk("post/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await postService.deletePost(id, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
})

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
            })
            .addCase(updateLikes.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateLikes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.likeStatus = action.payload.message;
            })
            .addCase(updateLikes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.likeStatus = null
            })
            .addCase(upload.pending, state => {
                state.isLoading = true;
            })
            .addCase(upload.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(upload.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deletePostings.pending, state => {
                state.isLoading = true;
            })
            .addCase(deletePostings.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(deletePostings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;