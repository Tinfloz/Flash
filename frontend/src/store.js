import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth/authSlice";
import postReducer from "./reducers/posts/postSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        myPosts: postReducer,
    }
});

export default store;