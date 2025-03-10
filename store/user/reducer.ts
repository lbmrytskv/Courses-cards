import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuth: boolean;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean; // ✅ Додаємо `isAdmin`
}

const initialState: UserState = {
  isAuth: false,
  name: '',
  email: '',
  token: '',
  isAdmin: JSON.parse(localStorage.getItem('isAdmin') || 'false'), // ✅ Відновлюємо з `localStorage`
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
      state.isAdmin = action.payload.isAdmin; // ✅ Зберігаємо статус `isAdmin`
    },
    logout(state) {
      state.isAuth = false;
      state.name = '';
      state.email = '';
      state.token = '';
      state.isAdmin = false;
      localStorage.removeItem('isAdmin'); // ✅ Видаляємо `isAdmin` при логауті
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
