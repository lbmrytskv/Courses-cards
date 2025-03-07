import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCourses, setCoursesError } from '../../store/courses/reducer';
import { setAuthors } from '../../store/authors/reducer';
import { getCourses, getAuthors } from '../../services';
import CourseCard from './components/CourseCard/CourseCard';
import EmptyCourseList from '../EmptyCourseList/EmptyCourseList';
import CreateCourse from './components/CreateCourse/CreateCourse';
import Button from '../../common/Button/Button';
import { RootState } from '../../store';

const Courses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isCreatingCourse = location.pathname === '/courses/add';

  const courses = useSelector((state: RootState) => state.courses.courses);
  const error = useSelector((state: RootState) => state.courses.error);
  const authors = useSelector((state: RootState) => state.authors);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getCourses();
        dispatch(setCourses(courses));
      } catch (error) {
        console.error('Error fetching courses:', error);
        dispatch(setCoursesError(error.message || 'Failed to fetch courses'));
      }
    };

    const fetchAuthors = async () => {
      try {
        const authors = await getAuthors();
        dispatch(setAuthors(authors));
      } catch (error) {
        console.error('Failed to fetch authors:', error);
      }
    };

    fetchCourses();
    fetchAuthors();
  }, [dispatch]);

  const getAuthorsNames = (authorIds: string[]) => {
    if (!authors || authors.length === 0) {
      return ''; 
    }

    return authors
      .filter((author) => authorIds.includes(author.id))
      .map((author) => author.name)
      .join(', ');
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const handleCourseCreated = () => {
    const fetchCourses = async () => {
      try {
        const courses = await getCourses();
        dispatch(setCourses(courses));
      } catch (error) {
        console.error('Error fetching courses:', error);
        dispatch(setCoursesError(error.message || 'Failed to fetch courses'));
      }
    };

    fetchCourses();
    navigate('/courses');
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(courses)) {
    return <div>Error: Courses data is not an array.</div>;
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <Button  
          buttonText="Add New Course" 
          onClick={() => navigate('/courses/add')} 
          className="add-course-button"
        />
      </div>

      <div className="courses">
        {isCreatingCourse ? (
          <CreateCourse existingCourse={null} onCreateCourse={handleCourseCreated} />
        ) : (
          <>
            {courses.length === 0 ? (
              <EmptyCourseList onClick={() => navigate('/courses/add')} />
            ) : (
              <>
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={{
                      ...course,
                      authorName: getAuthorsNames(course.authors),
                    }}
                    onClick={() => handleCourseClick(course.id)}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
