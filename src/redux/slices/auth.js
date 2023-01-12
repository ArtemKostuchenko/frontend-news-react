import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../axios";

export const fetchAuth = createAsyncThunk('/auth/fetchAuth', async(params) => {
    const {data} = await axios.post('/auth/login', params);
    return data;
});
export const fetchAuthorized = createAsyncThunk('/auth/fetchAuthorized', async() => {
    const {data} = await axios.get('/auth/me');
    return data;
});
export const fetchRegister = createAsyncThunk('/auth/fetchRegister', async(params) => {
    const {data} = await axios.post('/auth/register', params);
    return data
});
export const fetchUpdateProfile = createAsyncThunk('/auth/fetchUpdateProfile', async(params) => {
    const {data} = await axios.patch('/auth/profile', params);
    return data
});

const initialState = {
   data: null,
   status: 'loading',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        }
    },
    extraReducers: {
        [fetchAuth.pending]: (state) => {
            state.data = null;
            state.status = 'loading';
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = 'loaded';
        },
        [fetchAuth.rejected]: (state) => {
            state.data = null;
            state.status = 'error';
        },
        [fetchAuthorized.pending]: (state) => {
            state.data = null;
            state.status = 'loading';
        },
        [fetchAuthorized.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = 'loaded';
        },
        [fetchAuthorized.rejected]: (state) => {
            state.data = null;
            state.status = 'error';
        },
        [fetchRegister.pending]: (state) => {
            state.data = null;
            state.status = 'loading';
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = 'loaded';
        },
        [fetchRegister.rejected]: (state) => {
            state.data = null;
            state.status = 'error';
        },
        [fetchUpdateProfile.pending]: (state) => {
            state.status = 'loading';
        },
        [fetchUpdateProfile.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = 'loaded';
        },
        [fetchUpdateProfile.rejected]: (state) => {
            state.data = null;
            state.status = 'error';
        },
    },
});

export const selectIsAuth = state => Boolean(state.auth.data);

export const selectUser = state => state.auth.data;

export const authReducer = authSlice.reducer;

export const {logout} = authSlice.actions