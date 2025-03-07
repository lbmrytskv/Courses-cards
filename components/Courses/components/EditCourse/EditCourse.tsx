import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateCourse } from "../../../../store/courses/reducer";
import { setAuthors } from "../../../../store/authors/reducer";
import { getAuthors, updateCourseOnServer, getCourses } from "../../../../services";
import Input from "../../../../common/Input/Input";
import Button from "../../../../common/Button/Button";
import AuthorItem from "../CreateCourse/AuthorItem";
import { setCourses, setCoursesError } from "../../../../store/courses/reducer";
import { AppState } from "../../../../store/types";

const EditCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const courses = useSelector((state: AppState) => state.courses.courses); 
    const authors = useSelector((state: AppState) => state.authors); 

    const course = courses.find((c) => c.id === courseId);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const authors = await getAuthors();
                dispatch(setAuthors(authors));
            } catch (error) {
                console.error("Failed to fetch authors:", error);
            }
        };

        fetchAuthors();
    }, [dispatch]);

    if (!course) {
        return <p>Loading course data...</p>;
    }

    const [title, setTitle] = useState(course.title || "");
    const [description, setDescription] = useState(course.description || "");
    const [duration, setDuration] = useState(course.duration || "");
    const [newAuthorName, setNewAuthorName] = useState("");
        const [courseAuthors, setCourseAuthors] = useState(
            course.authors
                .map((authorId) => authors.find((a) => a.id === authorId))
                .filter((author): author is NonNullable<typeof author> => author !== undefined) 
        );
        
    const [errors, setErrors] = useState({ title: "", description: "", duration: "" });

    const validateForm = () => {
        const newErrors = { title: "", description: "", duration: "" };

        if (!title.trim()) newErrors.title = "Title is required.";
        if (!description.trim()) newErrors.description = "Description is required.";
        if (!duration || Number(duration) <= 0) newErrors.duration = "Duration is required.";

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "");
    };

    const handleFetchCourses = async () => {
        try {
            const courses = await getCourses();
            dispatch(setCourses(courses));
        } catch (error) {
            console.error("Error fetching courses:", error);
            dispatch(setCoursesError(error.message || "Failed to fetch courses"));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            console.error("❌ Validation failed. Update aborted.");
            return;
        }

        const updatedCourse = {
            ...course,
            title: String(title || "").trim(),
            description: String(description || "").trim(),
            duration: Number(duration),
            authors: courseAuthors.map((author) => author.id),
        };

        if (!updatedCourse.title || !updatedCourse.description || !updatedCourse.duration) {
            console.error("❌ Update blocked: Some fields are empty.");
            return;
        }

        console.log("🔄 Sending UPDATE request:", updatedCourse);

        try {
            await updateCourseOnServer(updatedCourse);
            dispatch(updateCourse(updatedCourse));
            await handleFetchCourses();
            navigate("/courses");
        } catch (error) {
            console.error("❌ Error while updating course:", error);
        }
    };

    return (
        <div className="course-container">
            <h1 className="course-title">Edit Course</h1>

            <div className="form-section">
                <label>Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className={errors.title ? "error-border" : ""} />
                {errors.title && <p className="error">{errors.title}</p>}
            </div>

            <div className="form-section">
                <label>Description</label>
                <textarea className={`textarea ${errors.description ? "error-border" : ""}`} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                {errors.description && <p className="error">{errors.description}</p>}
            </div>

            <div className="form-section">
                <label>Duration (minutes)</label>
                <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className={errors.duration ? "error-border" : ""} />
                {errors.duration && <p className="error">{errors.duration}</p>}
            </div>

            <div className="authors-section">
                <div className="authors-list">
                    <h3>Authors</h3>
                    <ul>
                        {authors.length > 0 ? (
                            authors.map((author) => <AuthorItem key={author.id} author={author} actionText="Add" onAction={() => setCourseAuthors([...courseAuthors, author])} />)
                        ) : (
                            <p>No authors available.</p>
                        )}
                    </ul>
                </div>
                <div className="course-authors-list">
                    <h3>Course Authors</h3>
                    <ul>
                        {courseAuthors.map((author) => (
                            <AuthorItem key={author.id} author={author} actionText="Remove" onAction={() => setCourseAuthors(courseAuthors.filter((a) => a.id !== author.id))} showDelete={false} />
                        ))}
                    </ul>
                </div>
            </div>

            <div className="form-buttons">
                <Button buttonText="Cancel" onClick={() => navigate("/courses")} />
                <Button buttonText="Update Course" onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default EditCourse;
