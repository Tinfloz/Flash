import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

console.log(user)

const initialState = {
    user: user ? user : null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
};

export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
    try {
        return await authService.register(userData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
    try {
        return await authService.login(userData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logout();
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = ""
        }
    },
    extraReducers: builder => {
        builder
            .addCase(register.pending, state => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isSuccess = true;
                state.isLoading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.user = null;
                state.message = action.payload
            })
            .addCase(login.pending, state => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isSuccess = true;
                state.isLoading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.user = null;
                state.message = action.payload
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user = null;
            })

    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;