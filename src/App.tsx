import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCourses } from './store/courses/reducer';
import { setAuthors } from './store/authors/reducer';
import { getCourses, getAuthors } from './services';
import Header from './components/Header/Header';
import Courses from './components/Courses/Courses';
import CreateCourse from './components/Courses/components/CreateCourse/CreateCourse';
import Login from './components/Courses/components/Login/Login';
import Registration from './components/Courses/components/Registration/Registration';
import CourseInfo from './components/CourseInfo/CourseInfo';
import './App.css'
import EditCourse from './components/Courses/components/EditCourse/EditCourse';




function App() {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state: any) => state.user); 
  useEffect(() => {
    if (isAuth) {
      async function fetchData() {
        try {
          const [courses, authors] = await Promise.all([getCourses(), getAuthors()]);
          dispatch(setCourses(courses));
          dispatch(setAuthors(authors));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      fetchData();
    }
  }, [dispatch, isAuth]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/courses" replace /> : <Login />}
        />
        <Route
          path="/registration"
          element={isAuth ? <Navigate to="/courses" replace /> : <Registration />}
        />
        <Route
          path="/courses"
          element={isAuth ? <Courses /> : <Navigate to="/login" replace />}
        />
     <Route
  path="/courses/add"
  element={isAuth ? <CreateCourse /> : <Navigate to="/login" replace />}
/>

<Route path="/courses/edit/:courseId" element={<EditCourse />} />


        <Route
          path="/courses/:courseId"
          element={isAuth ? <CourseInfo /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={isAuth ? "/courses" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;