import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Author {
  id: string;
  name: string;
}

const initialState: Author[] = [];

const authorsSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    setAuthors(state, action: PayloadAction<Author[]>) {
      return action.payload;
    },
    addAuthor(state, action: PayloadAction<Author>) {
      state.push(action.payload);
    },
    removeAuthor(state, action: PayloadAction<string>) { 
      return state.filter(author => author.id !== action.payload);
    },
  },
});

export const { setAuthors, addAuthor,removeAuthor } = authorsSlice.actions;
export default authorsSlice.reducer;