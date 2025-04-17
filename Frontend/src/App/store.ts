import { configureStore } from "@reduxjs/toolkit";
import authSlice from './AuthSlice'
import { apiSlice } from "./apiSlice";
import productFilterSlice from './productFilterSlice'
let store = configureStore({
    reducer: {
        server: apiSlice.reducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice,
        productfilter: productFilterSlice
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)
})

export default store


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;