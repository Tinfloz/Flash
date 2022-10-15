import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Reducers/userReducers"

const store = configureStore({
    reducer: {
        auth: authReducer
    }
});
export default store