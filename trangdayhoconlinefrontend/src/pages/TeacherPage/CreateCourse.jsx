import React, { useState } from 'react';
import "../../css/CreateCourse.css"; // Import CSS
import Header from '../../components/Header/HeaderTeacher';

const CourseForm = () => {
  const [courseData, setCourseData] = useState({
    courseName: '',
    description: '',
    startDate: '',
    endDate: '',
    instructorId: '',
    studentEmails: [], // Mảng để lưu các email
  });

  const [emailInput, setEmailInput] = useState(''); // State để lưu email đang nhập

  // Hàm xử lý khi người dùng thay đổi giá trị trong các input khác
  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  // Hàm thêm email vào danh sách khi nhấn Enter hoặc dấu phẩy
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && emailInput.trim()) {
      e.preventDefault();
      setCourseData({
        ...courseData,
        studentEmails: [...courseData.studentEmails, emailInput.trim()], // Thêm email mới vào mảng
      });
      setEmailInput(''); // Reset lại ô input
    }
  };

  // Hàm xóa email khỏi danh sách
  const removeEmail = (index) => {
    const updatedEmails = courseData.studentEmails.filter((email, i) => i !== index);
    setCourseData({
      ...courseData,
      studentEmails: updatedEmails,
    });
  };

  // Hàm xử lý khi gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(courseData);
  };

  return (
    <>
      <Header />
      <div className="course-form">
        <h2>Create Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label>Course Name:</label>
            <input
              type="text"
              name="courseName"
              value={courseData.courseName}
              onChange={handleChange}
              placeholder="Enter course name"
            />
          </div>
          <div className="form-section">
            <label>Course Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={courseData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-section">
            <label>Description:</label>
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleChange}
              placeholder="Enter course description"
            ></textarea>
          </div>
          <div className="form-section">
            <label>Course End Date:</label>
            <input
              type="date"
              name="endDate"
              value={courseData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-section">
            <label>Instructor ID:</label>
            <input
              type="text"
              name="instructorId"
              value={courseData.instructorId}
              onChange={handleChange}
              placeholder="Enter instructor ID"
            />
          </div>
          <div className="form-section">
            <label>Student Emails:</label>
            <div className="email-input-container">
              {courseData.studentEmails.map((email, index) => (
                <div key={index} className="email-tag">
                  {email}
                  <button type="button" onClick={() => removeEmail(index)}>x</button> {/* Nút xóa */}
                </div>
              ))}
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter emails, press Enter or comma to add"
              />
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <button type="submit" className="submit-btn">
              Create Course
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CourseForm;