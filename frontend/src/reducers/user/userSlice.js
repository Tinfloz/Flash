import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
    auth: user ? user : null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

export const register = createAsyncThunk("user/register", async (userCreds, thunkAPI) => {
    try {
        return await userService.registerUser(userCreds);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const login = createAsyncThunk("user/login", async (userCreds, thunkAPI) => {
    try {
        return await userService.loginUser(userCreds);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const setUserVisibility = createAsyncThunk("user/visibility", async (visibility, thunkAPI) => {
    try {
        console.log("set user visible running")
        const token = thunkAPI.getState().user.auth.token;
        return await userService.setProfileVisibility(visibility, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const updateUserDetails = createAsyncThunk("user/update", async (updates, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await userService.updateProfileDetails(token, updates)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const passwordUpdate = createAsyncThunk("user/password/update", async (updateDetails, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.auth.token;
        return await userService.updateUserPassword(token, updateDetails);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reset: state => initialState,
        resetHelpers: state => ({
            ...initialState,
            user: state.user
        }),
        logout: () => {
            localStorage.removeItem("user")
        }
    },
    extraReducers: builder => {
        builder
            .addCase(register.pending, state => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.auth = action.payload;
                state.isSuccess = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.auth = null;
                state.message = action.payload;
            })
            .addCase(login.pending, state => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.auth = action.payload;
                state.isSuccess = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.auth = null;
                state.isError = true;
                state.message = action.payload
            })
            .addCase(setUserVisibility.pending, state => {
                state.isLoading = true;
            })
            .addCase(setUserVisibility.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user.sendUser.visibility = action.payload.visibility
            })
            .addCase(setUserVisibility.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload
            })
            .addCase(updateUserDetails.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(passwordUpdate.pending, state => {
                state.isLoading = true;
            })
            .addCase(passwordUpdate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(passwordUpdate.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { reset, resetHelpers, logout } = userSlice.actions;
export default userSlice.reducer;