import React, { useState, useEffect } from 'react';
import RestClient from '../../client-api/rest-client.js';
import "../../css/CreateCourse.css"; // Import CSS
import Header from '../../components/Header/HeaderTeacher';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho ToastContainer

const EditCourseForm = () => {
  const [courseData, setCourseData] = useState({
    courseName: '',
    description: '',
    startDate: '',
    endDate: '',
    emails: [], // Mảng để lưu các email
  });

  const [emailInput, setEmailInput] = useState('');
  const restClient = new RestClient();
  
  // Lấy courseCode từ URL
  const courseCode = window.location.pathname.split('/').pop();

  // Hàm load dữ liệu khóa học từ API
  const loadCourseData = async () => {
    try {
      const response = await restClient
        .service(`courses/updateview/${courseCode}`)
        .find();
      
      if (response && response.status === 200) {
        const { courseName, description, startDate, endDate, emails } = response.course;
        setCourseData({
          courseName: courseName || '',
          description: description || '',
          startDate: startDate || '',
          endDate: endDate || '',
          emails: emails || []
        });
      } else {
        toast.error('Không thể tải dữ liệu khóa học.');
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu khóa học.');
    }
  };

  useEffect(() => {
    loadCourseData();
  }, []);

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
      if (!courseData.emails.includes(emailInput.trim())) {
        setCourseData({
          ...courseData,
          emails: [...courseData.emails, emailInput.trim()],
        });
        setEmailInput('');
        toast.success(`Email "${emailInput}" đã được thêm!`);
      } else {
        toast.warning('Email đã tồn tại trong danh sách sinh viên!');
      }
    }
  };

  // Hàm xóa email khỏi danh sách
  const removeEmail = (index) => {
    const updatedEmails = courseData.emails.filter((_, i) => i !== index);
    setCourseData({
      ...courseData,
      emails: updatedEmails,
    });
    toast.info('Email đã được xóa khỏi danh sách!');
  };

  // Kiểm tra ngày tháng hợp lệ
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Kiểm tra các trường bắt buộc
  const validateFields = () => {
    if (!courseData.courseName.trim()) {
      toast.error('Tên khóa học không được để trống!');
      return false;
    }
    if (!courseData.description.trim()) {
      toast.error('Mô tả khóa học không được để trống!');
      return false;
    }
    if (!isValidDate(courseData.startDate)) {
      toast.error('Ngày bắt đầu không hợp lệ!');
      return false;
    }
    if (!isValidDate(courseData.endDate)) {
      toast.error('Ngày kết thúc không hợp lệ!');
      return false;
    }
    return true;
  };

  // Hàm xử lý khi gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFields()) return;

    try {
      const response = await restClient
        .service(`courses/${courseCode}`)
        .patch({
          courseName: courseData.courseName,
          description: courseData.description,
          startDate: courseData.startDate,
          endDate: courseData.endDate,
          emails: courseData.emails,
        });

      if (response && response.status === 200) {
        toast.success('Khóa học đã được cập nhật thành công!');
      } else {
        toast.error('Cập nhật khóa học thất bại.');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Có lỗi xảy ra khi cập nhật khóa học.');
    }
  };

  return (
    <>
      <Header />
      <div className="course-form">
        <h2>Edit Course</h2>
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
            <label>Student Emails:</label>
            <div className="email-input-container">
              {courseData.emails.map((email, index) => (
                <div key={index} className="email-tag">
                  {email}
                  <button type="button" onClick={() => removeEmail(index)}>x</button>
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
          <button type="submit" className="submit-btn">Update Course</button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditCourseForm;
