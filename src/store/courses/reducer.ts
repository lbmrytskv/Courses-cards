import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '../../services';


interface CoursesState {
  courses: Course[];
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses(state, action: PayloadAction<Course[]>) {
      state.courses = action.payload;
      state.error = null;
    },
    setCoursesError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    deleteCourse(state, action: PayloadAction<string>) {
      state.courses = state.courses.filter(course => course.id !== action.payload);
    },
    updateCourse(state, action: PayloadAction<Course>) {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
    
      if (index !== -1) {
        
        if (!action.payload.title.trim() || !action.payload.description.trim() || !action.payload.duration) {
          console.error("❌ Reducer blocked update: Some fields are empty.");
          return; 
        }
    
        state.courses[index] = action.payload; 
      }
    }
    ,
    addCourse(state, action: PayloadAction<Course>) {
      state.courses.push(action.payload); 
    },
  },
});

export const { setCourses, setCoursesError, deleteCourse, addCourse, updateCourse } = coursesSlice.actions;

export default coursesSlice.reducer;
