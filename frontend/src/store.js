import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./reducers/auth/authSlice";
import userReducer from "./reducers/user/userSlice";
// import postReducer from "./reducers/posts/pSlice";
import postReducer from "./reducers/post/postSlice"
import searchReducer from "./reducers/search/searchSlice";
import requestReducer from "./reducers/followRequests/followRequestSlice";


const store = configureStore({
    reducer: {
        user: userReducer,
        post: postReducer,
        search: searchReducer,
        requests: requestReducer,
    }
});

export default store;