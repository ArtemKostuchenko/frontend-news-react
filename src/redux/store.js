import { configureStore } from "@reduxjs/toolkit";
import { newsReducer } from "./slices/news";
import { authReducer } from "./slices/auth";



const store = configureStore({
    reducer: {
        news: newsReducer,
        auth: authReducer
    }
});

export default store;