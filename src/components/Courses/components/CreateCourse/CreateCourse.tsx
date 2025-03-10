import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCourse, updateCourse, setCourses, setCoursesError } from '../../../../store/courses/reducer';
import { setAuthors, removeAuthor } from '../../../../store/authors/reducer';
import { getAuthors, addAuthor, addCourseToServer, updateCourseOnServer, deleteAuthorFromServer, getCourses } from '../../../../services';
import Input from '../../../../common/Input/Input';
import Button from '../../../../common/Button/Button';
import AuthorItem from './AuthorItem';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../../../../store/types';

interface CreateCourseProps {
    existingCourse: any;
    onCreateCourse: (updatedCourse: any) => void;
  }

  const CreateCourse: React.FC<CreateCourseProps> = ({ existingCourse, onCreateCourse }) => {
    const dispatch = useDispatch();
    const authors = useSelector((state: AppState) => state.authors);
    const navigate = useNavigate();

    const [title, setTitle] = useState(existingCourse ? existingCourse.title : '');
    const [description, setDescription] = useState(existingCourse ? existingCourse.description : '');
    const [duration, setDuration] = useState(existingCourse ? existingCourse.duration : '');
    const [newAuthorName, setNewAuthorName] = useState('');
    const [courseAuthors, setCourseAuthors] = useState(existingCourse ? existingCourse.authors.map(authorId => authors.find(a => a.id === authorId)).filter(Boolean) : []);
    const [errors, setErrors] = useState({ title: '', description: '', duration: '' });

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const authors = await getAuthors();
                dispatch(setAuthors(authors));
            } catch (error) {
                console.error('Failed to fetch authors:', error);
            }
        };

        fetchAuthors();
    }, [dispatch]);

    const validateForm = () => {
        const newErrors = { title: '', description: '', duration: '' };

        if (!title.trim()) newErrors.title = "Title is required.";
        if (!description.trim()) newErrors.description = "Description is required.";
        if (!duration || Number(duration) <= 0) newErrors.duration = "Duration is required.";

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const addAuthorToCourse = (authorId) => {
        const author = authors.find((a) => a.id === authorId);
        if (author && !courseAuthors.some((a) => a.id === author.id)) {
            setCourseAuthors([...courseAuthors, author]);
        }
    };

    const removeAuthorFromCourse = (authorId) => {
        setCourseAuthors(courseAuthors.filter((a) => a.id !== authorId));
    };

    const handleAddAuthor = async () => {
        if (!newAuthorName.trim()) return;

        try {
            const newAuthor = await addAuthor(newAuthorName);
            setNewAuthorName('');
            const authors = await getAuthors();
            dispatch(setAuthors(authors));
        } catch (error) {
            console.error('Error adding author:', error);
        }
    };

    const handleDeleteAuthor = async (authorId) => {
        try {
            await deleteAuthorFromServer(authorId);
            dispatch(removeAuthor(authorId));
        } catch (error) {
            console.error('Failed to delete author:', error);
        }
    };

    const handleFetchCourses = async () => {
        try {
            const courses = await getCourses();
            dispatch(setCourses(courses));
        } catch (error) {
            console.error('Error fetching courses:', error);
            dispatch(setCoursesError(error.message || 'Failed to fetch courses'));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return; 

        const courseData = {
            id: existingCourse ? existingCourse.id : Date.now().toString(),
            title,
            description,
            duration: Number(duration),
            authors: courseAuthors.map((author) => author.id),
            creationDate: existingCourse ? existingCourse.creationDate : new Date().toISOString(),
        };

        try {
            if (existingCourse) {
                await updateCourseOnServer(courseData);
                dispatch(updateCourse(courseData));
            } else {
                const savedCourse = await addCourseToServer(courseData);
                dispatch(addCourse(savedCourse.result));
            }
            await handleFetchCourses();
            navigate('/courses');
        } catch (error) {
            console.error(`❌ Error while ${existingCourse ? 'updating' : 'saving'} course:`, error);
        }
    };

    return (
        <div className="course-container">
            <h1 className="course-title">{existingCourse ? 'Edit Course' : 'Create Course'}</h1>

            <div className="form-section">
                <label>Title</label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={errors.title ? "error-border" : ""}
                />
                {errors.title && <p className="error">{errors.title}</p>}
            </div>

            <div className="form-section">
                <label>Description</label>
                <textarea
                    className={`textarea ${errors.description ? "error-border" : ""}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                {errors.description && <p className="error">{errors.description}</p>}
            </div>

            <div className="form-section">
                <label>Duration (minutes)</label>
                <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={errors.duration ? "error-border" : ""}
                />
                {errors.duration && <p className="error">{errors.duration}</p>}
            </div>

            <div className="authors-section">
                <div className="authors-list">
                    <h3>Authors</h3>
                    <ul>
                        {authors.length > 0 ? (
                            authors.map((author) => (
                                <AuthorItem 
                                    key={author.id}
                                    author={author}
                                    actionText="Add"
                                    onAction={addAuthorToCourse}
                                    onDelete={handleDeleteAuthor}
                                />
                            ))
                        ) : (
                            <p>No authors available.</p>
                        )}
                    </ul>
                    <div className="new-author-section">
                        <Input 
                            placeholderText="New Author Name" 
                            value={newAuthorName} 
                            onChange={(e) => setNewAuthorName(e.target.value)} 
                        />
                        <Button buttonText="Create Author" onClick={handleAddAuthor} className="button small-button" />
                    </div>
                </div>
                <div className="course-authors-list">
                    <h3>Course Authors</h3>
                    <ul>
                        {courseAuthors.map((author) => (
                            <AuthorItem 
                                key={author.id} 
                                author={author} 
                                actionText="Remove" 
                                onAction={removeAuthorFromCourse} 
                                showDelete={false} 
                            />
                        ))}
                    </ul>
                </div>
            </div>

            <div className="form-buttons">
                <Button buttonText="Cancel" onClick={() => navigate('/courses')} />
                <Button buttonText={existingCourse ? "Update Course" : "Create Course"} onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default CreateCourse;