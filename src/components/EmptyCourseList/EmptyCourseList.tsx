import React from 'react';
import Button from '../../common/Button/Button';

const EmptyCourseList = ({ onClick }) => {
  return (
    <div className="empty-course-list">
      <h2>Course List is Empty</h2>
      <p>Please use the "Add New Course" button to add your first course.</p>
      <Button buttonText="Add New Course" onClick={onClick} />
    </div>
  );
};

export default EmptyCourseList;