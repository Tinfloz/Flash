import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./reducers/auth/authSlice";
import userReducer from "./reducers/user/userSlice";
// import postReducer from "./reducers/posts/pSlice";
import postReducer from "./reducers/post/postSlice"
import feedReducer from "./reducers/feed/feedSlice";
import searchReducer from "./reducers/search/searchSlice";
import userProfReducer from "./reducers/userProfile/userProfSlice"

const store = configureStore({
    reducer: {
        user: userReducer,
        post: postReducer,
        feed: feedReducer,
        search: searchReducer,
        userProf: userProfReducer,
    }
});

export default store;