import { createSlice, PayloadAction } from '@reduxjs/toolkit';

let authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token'),
    },
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
            if (action.payload) {
                localStorage.setItem('token', action.payload);
            } else {
                localStorage.removeItem('token');
            }
        },
        logout: (state) => {
            state.token = null;
            localStorage.removeItem('token');
        }
    }
});

export default authSlice.reducer;
export let { logout, setToken } = authSlice.actions;
