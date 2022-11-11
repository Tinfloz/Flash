import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {
    post: [],
    isSuccess: null,
    isError: null,
    isLoading: false,
    message: ""
};

export const createPosts = createAsyncThunk("post/create", async (post, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await postService.uploadPosts(post, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const getLoggedPosts = createAsyncThunk("post/getLogged", async (param, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await postService.getLoggedInPosts(token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const getFolPosts = createAsyncThunk("post/getFol", async (param, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await postService.getFollowingPosts(token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const deletePost = createAsyncThunk("post/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await postService.deletePosts(token, id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const likeAndUnlikePosts = createAsyncThunk("post/like", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token;
        return await postService.changeLikeStatus(id, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});



const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: state => initialState,
        resetHelpers: state => ({
            ...initialState,
            post: state.post
        })
    },
    extraReducers: builder => {
        builder
            .addCase(createPosts.pending, state => {
                state.isLoading = true;
            })
            .addCase(createPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(createPosts.rejected, state => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(getLoggedPosts.pending, state => {
                state.isLoading = true;
            })
            .addCase(getLoggedPosts.fulfilled, (state, action) => {
                state.post = action.payload.posts;
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(getLoggedPosts.rejected, (state, action) => {
                state.post = [];
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getFolPosts.pending, state => {
                state.isLoading = true;
            })
            .addCase(getFolPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.post = action.payload.posts;
                state.isSuccess = true;
            })
            .addCase(getFolPosts.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.post = [];
                state.message = action.payload;
            })
            .addCase(deletePost.pending, state => {
                state.isLoading = true;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false;
                let newPost = state.post.filter(post => post._id !== action.payload.id);
                state.post = newPost;
                state.isSuccess = true;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(likeAndUnlikePosts.pending, state => {
                state.isLoading = true;
            })
            .addCase(likeAndUnlikePosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                let newPost = state.post.map(post => {
                    if (post._id === action.payload.post) {
                        post.likes = action.payload.likes
                    }
                    return post
                })
                state.post = newPost;
            })
            .addCase(likeAndUnlikePosts.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.message = action.payload;
            })
    }
});

export const { reset, resetHelpers } = postSlice.actions;
export default postSlice.reducer;