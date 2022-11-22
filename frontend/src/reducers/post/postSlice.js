import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {
    user: {
        posts: null,
        searchedUser: null,
        loggedInUser: null,
    },
    isSuccess: null,
    isError: null,
    isLoading: false,
    message: ""
};

export const createPosts = createAsyncThunk("post/create", async (post, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await postService.uploadPosts(post, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const getLoggedPosts = createAsyncThunk("post/getLogged", async (param, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await postService.getLoggedInPosts(token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const getFolPosts = createAsyncThunk("post/getFol", async (param, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await postService.getFollowingPosts(token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const deletePost = createAsyncThunk("post/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await postService.deletePosts(token, id);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const likeAndUnlikePosts = createAsyncThunk("post/like", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await postService.changeLikeStatus(id, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const searchAndGetUserProfs = createAsyncThunk("post/searchAndGet", async (name, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await postService.getSearchedUserProf(name, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const followAndUnfollowUser = createAsyncThunk("post/followUnfollow", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await postService.folUnfolUsers(id, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const addComments = createAsyncThunk("post/add/comments", async (commentInfo, thunkAPI) => {
    try {
        const { postId, comment } = commentInfo;
        console.log(postId, comment)
        const token = thunkAPI.getState().user.auth.token;
        return await postService.addPostComments(postId, token, comment)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const editComments = createAsyncThunk("post/edit/comments", async (commentEdited, thunkAPI) => {
    try {
        const { commentId, postId, newComment } = commentEdited;
        console.log(commentId, postId, newComment)
        const token = thunkAPI.getState().user.auth.token;
        return await postService.editPostComments(postId, commentId, newComment, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const deleteComments = createAsyncThunk("post/delete/comments", async (deleteInfo, thunkAPI) => {
    try {
        const { postId, commentId } = deleteInfo;
        const token = thunkAPI.getState().user.auth.token;
        return await postService.deletePostComments(postId, commentId, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const updateCaptionPost = createAsyncThunk("post/update/caption", async (captionDetails, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        const { postId, caption } = captionDetails;
        console.log(postId, caption)
        return await postService.updatePostCaption(token, postId, caption);
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
        reset: state => ({
            ...initialState,
        }),
        resetHelpers: state => ({
            ...initialState,
            user: state.user
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
                state.isLoading = false;
                state.isSuccess = true;
                state.user = { ...state.user, posts: action.payload.posts }
            })
            .addCase(getLoggedPosts.rejected, (state, action) => {
                state.user = {};
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getFolPosts.pending, state => {
                state.isLoading = true;
            })
            .addCase(getFolPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = { ...state.user, posts: action.payload.posts };
                state.isSuccess = true;
            })
            .addCase(getFolPosts.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.user = {};
                state.message = action.payload;
            })
            .addCase(deletePost.pending, state => {
                state.isLoading = true;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newPosts = state.user.posts.filter(post => post._id !== action.payload.id);
                const newUser = { ...state.user, posts: newPosts };
                state.user = newUser
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
                let newPost = state.user.posts.map(post => {
                    if (post._id === action.payload.post) {
                        post.likes = action.payload.likes;
                    }
                    return post;
                });
                let newUser = { ...state.user, posts: newPost };
                state.user = newUser;
            })
            .addCase(likeAndUnlikePosts.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.message = action.payload;
            })
            .addCase(searchAndGetUserProfs.pending, state => {
                state.isLoading = true;
            })
            .addCase(searchAndGetUserProfs.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.isLoading = false;
                state.user.posts = action.payload.posts;
                state.user.searchedUser = action.payload.searchedUser;
                state.user.loggedInUser = action.payload.loggedInUser;
            })
            .addCase(searchAndGetUserProfs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.user = [];
                state.message = action.payload;
            })
            .addCase(followAndUnfollowUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(followAndUnfollowUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                let newUser;
                if (state.user.searchedUser.visibility === "Private" &&
                    !state.user.searchedUser.followers.includes(action.payload.sender) &&
                    !state.user.searchedUser.pendingRequests.includes(action.payload.sender)) {
                    const newPendingRequests = [...state.user.searchedUser.pendingRequests, action.payload.sender]
                    const newSearchedUser = { ...state.user.searchedUser, pendingRequests: newPendingRequests };
                    newUser = { ...state.user, searchedUser: newSearchedUser, };
                };
                if (state.user.searchedUser.visibility === "Public" &&
                    !state.user.searchedUser.followers.includes(action.payload.sender)) {
                    const newFollowers = [...state.user.searchedUser.followers, action.payload.sender];
                    const newSearchedUser = { ...state.user.searchedUser, followers: newFollowers };
                    newUser = { ...state.user, searchedUser: newSearchedUser, };
                }
                if ((state.user.searchedUser.visibility === "Private" &&
                    state.user.searchedUser.followers.includes(action.payload.sender)) ||
                    (state.user.searchedUser.visibility === "Public" &&
                        state.user.searchedUser.followers.includes(action.payload.sender))) {
                    const newFollowers = state.user.searchedUser.followers.filter(follower => follower !== action.payload.sender);
                    const newSearchedUser = { ...state.user.searchedUser, followers: newFollowers };
                    newUser = { ...state.user, searchedUser: newSearchedUser, };
                }
                if (state.user.searchedUser.visibility === "Private" &&
                    state.user.searchedUser.pendingRequests.includes(action.payload.sender)) {
                    const newPendingRequests = state.user.searchedUser.pendingRequests.filter(request => request !== action.payload.sender);
                    const newSearchedUser = { ...state.user.searchedUser, pendingRequests: newPendingRequests };
                    newUser = { ...state.user, searchedUser: newSearchedUser, }
                }
                state.user = newUser;
            })
            .addCase(followAndUnfollowUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addComments.pending, state => {
                state.isLoading = true;
            })
            .addCase(addComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                let newComments = action.payload.comment;
                const newPosts = state.user.posts.map(post => {
                    if (post._id === action.payload.postId) {
                        post.comments = newComments;
                    };
                    return post;
                });
                const newUser = { ...state.user, posts: newPosts };
                state.user = newUser;
            })
            .addCase(addComments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = action.payload;
            })
            .addCase(editComments.pending, state => {
                state.isLoading = true;
            })
            .addCase(editComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newPosts = state.user.posts.map(post => {
                    if (post._id === action.payload.postId) {
                        const newComments = post.comments.map(com => {
                            if (com._id === action.payload.commentId) {
                                com.comment = action.payload.newComment;
                            }
                            return com;
                        })
                        post.comments = newComments;
                    }
                    return post;
                })
                const newUser = { ...state.user, posts: newPosts };
                state.user = newUser;
            })
            .addCase(editComments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteComments, state => {
                state.isLoading = true;
            })
            .addCase(deleteComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newPosts = state.user.posts.map(post => {
                    if (post._id === action.payload.postId) {
                        post.comments = post.comments.filter(comment => comment._id !== action.payload.commentId)
                    }
                    return post;
                })
                const newUser = { ...state.user, posts: newPosts }
                state.user = newUser;
            })
            .addCase(deleteComments.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.message = action.payload;
            })
            .addCase(updateCaptionPost.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateCaptionPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newPosts = state.user.posts.map(post => {
                    if (post._id === action.payload.postId) {
                        post.caption = action.payload.caption
                    }
                    return post
                })
                let newUser = { ...state.user, posts: newPosts };
                state.user = newUser;
            })
            .addCase(updateCaptionPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { reset, resetHelpers } = postSlice.actions;
export default postSlice.reducer;


