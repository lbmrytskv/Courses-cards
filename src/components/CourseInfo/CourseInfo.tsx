import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../common/Button/Button";
import { RootState } from "../../store";

export default function CourseInfo() {
  const { courseId } = useParams();
  
  
  const courses = useSelector((state: RootState) => state.courses.courses);
  const authors = useSelector((state: RootState) => state.authors);
  const coursesError = useSelector((state: RootState) => state.courses.error);

  
  const course = courses?.find((course) => course.id === courseId);

  
  if (!courses || !authors) {
    return <p>Loading...</p>;
  }

 
  if (coursesError) {
    return <p>Error loading courses: {coursesError}</p>;
  }

  if (!course) {
    return (
      <div className="course-info-container">
        <p>Course not found.</p>
        <Link to="/courses">
          <Button buttonText="Back to Courses" />
        </Link>
      </div>
    );
  }

 
  const courseAuthors = authors.filter((author) =>
    course.authors.includes(author.id)
  );

  return (
    <div className="course-info-container">
      <h2 className="course-header">{course.title}</h2>
      <div className="course-content">
        <div className="course-description">
          <h3 className="course-subheader">Description</h3>
          <p>{course.description}</p>
        </div>
        <div className="course-divider"></div>
        <div className="course-details">
          <p><strong>ID:</strong> {course.id}</p>
          <p><strong>Duration:</strong> {course.duration} minutes</p>
          <p><strong>Created:</strong> {course.creationDate}</p>
          <p><strong>Authors:</strong> {courseAuthors.map(author => author.name).join(", ")}</p>
        </div>
      </div>
      <div className="course-footer">
        <Link to="/courses">
          <Button buttonText="Back to Courses" />
        </Link>
      </div>
    </div>
  );
  
}