import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCourse } from "../../../../store/courses/reducer";
import { updateCourse } from "../../../../store/courses/actions"; 
import { FaTrash, FaEdit } from "react-icons/fa";
import Button from "../../../../common/Button/Button";
import CreateCourse from "../CreateCourse/CreateCourse"; 
import { deleteCourseFromServer } from "../../../../services";
import { useNavigate } from 'react-router-dom';
import { RootState } from "../../../../store";



const CourseCard = ({ course, onClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authors = useSelector((state: RootState) => state.authors);
  const [isEditing, setIsEditing] = useState(false); 

  const handleDelete = async () => {
    try {
        await deleteCourseFromServer(course.id);
        dispatch(deleteCourse(course.id)); 
    } catch (error) {
        console.error("❌ Error while deleting course:", error);
    }
};


const handleEdit = () => {
  navigate(`/courses/edit/${course.id}`);
};
  const handleUpdateCourse = (updatedCourse) => {
    dispatch(updateCourse(updatedCourse)); 
    setIsEditing(false); 
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours < 10 ? "0" : ""}${hours}:${mins < 10 ? "0" : ""}${mins} ${
      hours === 1 ? "hour" : "hours"
    }`;
};


  const formatDate = (dateString) => {
    console.log("📆 Formatting date:", dateString); 

    if (!dateString) return "No date available"; 
    
    
    const dateParts = dateString.split("/");
    if (dateParts.length === 3) {
        dateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; 
    }

    const date = new Date(dateString);
    console.log("📅 Parsed date:", date);

    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString("en-GB").replace(/\//g, ".");
};





  const authorsNames = course.authors
    .map((authorId) => authors.find((author) => author.id === authorId)?.name)
    .filter((name) => name)
    .join(", ");

  return (
    <div className="course-card">
      {isEditing ? (
        <CreateCourse existingCourse={course} onCreateCourse={handleUpdateCourse} />
      ) : (
        <div className="course-card-content">
          <div className="course-left">
            <h2 className="course-title">{course.title}</h2>
            <p className="course-description">{course.description}</p>
          </div>
          <div className="course-right">
            <p>
              <strong>Authors:</strong> {authorsNames}
            </p>
            <p>
              <strong>Duration:</strong> {formatDuration(course.duration)}
            </p>
            <p>
              <strong>Created:</strong> {formatDate(course.creationDate)}
            </p>
            <div className="course-actions">
              <Button buttonText={<FaTrash />} onClick={handleDelete} />
              <Button buttonText={<FaEdit />} onClick={handleEdit} />
              <Button buttonText="Show Course" onClick={onClick} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;