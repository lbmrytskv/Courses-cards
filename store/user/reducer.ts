import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuth: boolean;
  name: string;
  email: string;
  token: string;
}

const initialState: UserState = {
  isAuth: false,
  name: '',
  email: '',
  token: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ name: string; email: string; token: string }>) {
      state.isAuth = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuth = false;
      state.name = '';
      state.email = '';
      state.token = '';
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
