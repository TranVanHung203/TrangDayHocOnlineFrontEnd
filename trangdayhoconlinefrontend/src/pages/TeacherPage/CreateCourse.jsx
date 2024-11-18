import React, { useState, useEffect } from 'react';
import "../../css/CreateCourse.css"; // Import CSS
import Header from '../../components/Header/HeaderTeacher';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho ToastContainer

const CourseForm = () => {
  const [courseData, setCourseData] = useState({
    courseName: '',
    description: '',
    startDate: '',
    endDate: '',
    emails: [], // Mảng để lưu các email
  });

  const [emailInput, setEmailInput] = useState(''); // State để lưu email đang nhập
  const [isAuthorized, setIsAuthorized] = useState(false); // Kiểm tra quyền truy cập

  // Kiểm tra quyền truy cập từ localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('role'); // Lấy role từ localStorage
    if (storedRole === 'Lecturer') {
      setIsAuthorized(true); // Nếu role là Lecturer, cho phép truy cập
    } else {
      toast.error('Bạn không được phép truy cập.');
    }
  }, []);

  if (!isAuthorized) {
    // Nếu không có quyền, hiển thị thông báo lỗi
    return <p style={{ color: 'red', textAlign: 'center' }}>Bạn không được phép truy cập.</p>;
  }

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

      // Kiểm tra email đã tồn tại trong danh sách chưa
      if (!courseData.emails.includes(emailInput.trim())) {
        setCourseData({
          ...courseData,
          emails: [...courseData.emails, emailInput.trim()],
        });
        setEmailInput(''); // Reset lại input
        toast.success(`Email "${emailInput}" đã được thêm!`);
      } else {
        toast.error('Email đã tồn tại trong danh sách sinh viên!');
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

  // Hàm kiểm tra ngày tháng hợp lệ
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); // Kiểm tra ngày có hợp lệ không
  };

  // Hàm kiểm tra tất cả các trường bắt buộc
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
    return true; // Tất cả các trường đều hợp lệ
  };

  // Hàm xử lý khi gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!validateFields()) {
      return; // Nếu có lỗi, dừng không gửi form
    }

    try {
      // Gửi dữ liệu khóa học tới backend (giả lập)
      console.log('Sending course data:', courseData);
      toast.success('Khóa học đã được tạo thành công!');
      setCourseData({
        courseName: '',
        description: '',
        startDate: '',
        endDate: '',
        emails: [],
      });
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại.');
    }
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
            <label>Student Emails:</label>
            <div className="email-input-container">
              {courseData.emails.map((email, index) => (
                <div key={index} className="email-tag">
                  {email}
                  <button type="button" onClick={() => removeEmail(index)}>
                    x
                  </button>
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
      <ToastContainer />
    </>
  );
};

export default CourseForm;
