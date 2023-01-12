import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../axios";
export const fetchNews = createAsyncThunk('news/fetchNews', async() => {
    const {data} = await axios.get('/news');
    return data;
});

export const fetchPopularNews = createAsyncThunk('news/fetchPopularNews', async() => {
    const {data} = await axios.get('/news/popular');
    return data;
});

export const fetchDeleteNews = createAsyncThunk('news/fetchDeleteNews', async(id) => {
    await axios.delete(`/news/${id}`);
});



const initialState = {
    news: {
        items: [],
        status: 'loading'
    },
    popularNews: {
        items: [],
        status: 'loading'
    }
}

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducer:{},
    extraReducers: {
        // отримання новин
        [fetchNews.pending]: (state) => {
            state.news.status = 'loading';
            state.news.items = [];
        },
        [fetchNews.fulfilled]: (state, action) => {
            state.news.status = 'loaded';
            state.news.items = action.payload;
        },
        [fetchNews.rejected]: (state) => {
            state.news.status = 'error';
            state.news.items = [];
        },
        // видалення новини
        [fetchDeleteNews.pending]: (state, action) => {
            state.news.items = state.news.items.filter(obj => obj._id !== action.meta.arg);
        },
        // отримання популярних новин
        [fetchPopularNews.pending]: (state) => {
            state.popularNews.status = 'loading';
            state.popularNews.items = [];
        },
        [fetchPopularNews.fulfilled]: (state, action) => {
            state.popularNews.status = 'loaded';
            state.popularNews.items = action.payload;
        },
        [fetchPopularNews.rejected]: (state) => {
            state.popularNews.status = 'error';
            state.popularNews.items = [];
        },
    }
})

export const selectPopularNews = state => state.news.popularNews;
export const selectNews = state => state.news.news;

export const newsReducer = newsSlice.reducer;