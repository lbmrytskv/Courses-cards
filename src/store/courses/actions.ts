import { SET_COURSES, SET_COURSES_ERROR, ADD_COURSE } from './types';
import { getCourses } from '../../services';
import { Course } from '../../services';


export const addCourse = (course: Course) => ({
  type: ADD_COURSE,
  payload: course,
});

export const setCourses = (courses: Course[]) => ({
  type: SET_COURSES,
  payload: courses,
});

export const setCoursesError = (error: string) => ({
  type: SET_COURSES_ERROR,
  payload: error,
});

export const updateCourse = (course: Course) => ({
  type: 'UPDATE_COURSE',
  payload: course,
});

export const fetchCourses = () => async (dispatch: any) => {
  try {
    const courses = await getCourses();
    console.log("Fetched courses:", courses);
    dispatch(setCourses(courses));
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    dispatch(setCoursesError(error.message || 'Failed to fetch courses'));
  }
};