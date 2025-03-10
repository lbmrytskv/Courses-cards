import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuth: boolean;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean; 
}

const initialState: UserState = {
  isAuth: false,
  name: '',
  email: '',
  token: '',
  isAdmin: JSON.parse(localStorage.getItem('isAdmin') || 'false'), 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ name: string; email: string; token: string; isAdmin: boolean }>
    ) {
      state.isAuth = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.isAdmin = action.payload.isAdmin; 
    },
    logout(state) {
      state.isAuth = false;
      state.name = '';
      state.email = '';
      state.token = '';
      state.isAdmin = false;
      localStorage.removeItem('isAdmin'); 
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
