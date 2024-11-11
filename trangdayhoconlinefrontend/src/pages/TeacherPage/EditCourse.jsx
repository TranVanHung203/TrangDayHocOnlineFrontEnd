import React, { useState, useEffect } from 'react';
import "../../css/CreateCourse.css"; // Import CSS
import Header from '../../components/Header/HeaderTeacher';

const CourseForm = () => {
  const [courseData, setCourseData] = useState({
    studentEmails: [] // Initialize studentEmails as an empty array
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
      // Kiểm tra email đã tồn tại trong mảng studentEmails chưa
      const existingEmail = courseData.studentEmails.find(email => email === emailInput.trim());
      if (!existingEmail) {
        setCourseData(prevCourseData => ({
          ...prevCourseData,
          studentEmails: [
            ...prevCourseData.studentEmails,
            emailInput.trim() // Chỉ thêm email mới vào mảng
          ],
        }));
        setEmailInput(''); // Reset lại ô input
      } else {
        alert('Email đã tồn tại trong danh sách sinh viên!'); // Thông báo nếu email đã tồn tại
      }
    }
  };

  // Hàm xóa email khỏi danh sách
  const removeEmail = (index) => {
    const updatedEmails = courseData.studentEmails.filter((_, i) => i !== index);
    setCourseData(prevCourseData => ({
      ...prevCourseData,
      studentEmails: updatedEmails,
    }));
  };

  // Hàm xử lý khi gửi form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Lấy courseCode từ URL
    const courseCode = window.location.pathname.split('/').pop(); // Lấy phần cuối cùng của URL

    // Log the course data before sending
    console.log("Course data to update:", { ...courseData, courseCode });

    try {
      const response = await fetch(`http://localhost:5000/updatecourses/load-course/${courseCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...courseData,
          maKhoaHoc: courseCode // Ensure maKhoaHoc is included in the request
        }), // Gửi dữ liệu khóa học
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Update successful:", data);
        alert("Cập nhật khóa học thành công!"); // Thông báo thành công
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        alert(`Cập nhật thất bại: ${errorData.message || "Có lỗi xảy ra!"}`);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Đã xảy ra lỗi khi cập nhật khóa học.");
    }
  };

  // Hàm load dữ liệu khóa học từ API
  const loadCourseData = async (courseCode) => {
    try {
      const response = await fetch(`http://localhost:5000/updatecourses/load-course/${courseCode}`);
      const data = await response.json();
      console.log("API Data:", data); // In ra dữ liệu nhận được để kiểm tra cấu trúc

      if (response.ok) {
        // Cập nhật courseData với dữ liệu nhận được, bao gồm cả studentEmails
        setCourseData({
          ...data.course,
          studentEmails: data.studentEmails.map(student => student.email) || [] // Chỉ lấy email từ dữ liệu
        });
      } else {
        console.error("Error fetching course data:", data);
      }
    } catch (error) {
      console.error("Error loading course data:", error);
    }
  };

  // Sử dụng useEffect để load dữ liệu khi component mount
  useEffect(() => {
    // Lấy courseCode từ URL
    const courseCode = window.location.pathname.split('/').pop(); // Lấy phần cuối cùng của URL
    loadCourseData(courseCode); // Gọi hàm load với courseCode lấy được
  }, []); // Chạy một lần khi component mount

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
              name="tenKhoaHoc" // Ensure name matches your API
              value={courseData.tenKhoaHoc || ''} // Sử dụng tên khóa học từ dữ liệu
              onChange={handleChange}
              placeholder="Enter course name"
            />
          </div>
          <div className="form-section">
            <label>Course Start Date:</label>
            <input
              type="date"
              name="ngayBatDau" // Ensure name matches your API
              value={courseData.ngayBatDau ? new Date(courseData.ngayBatDau).toISOString().split('T')[0] : ''} // Chuyển đổi định dạng ngày
              onChange={handleChange}
            />
          </div>
          <div className="form-section">
            <label>Description:</label>
            <textarea
              name="moTa" // Ensure name matches your API
              value={courseData.moTa || ''} // Sử dụng mô tả từ dữ liệu
              onChange={handleChange}
              placeholder="Enter course description"
            ></textarea>
          </div>
          <div className="form-section">
            <label>Course End Date:</label>
            <input
              type="date"
              name="ngayKetThuc" // Ensure name matches your API
              value={courseData.ngayKetThuc ? new Date(courseData.ngayKetThuc).toISOString().split('T')[0] : ''} // Chuyển đổi định dạng ngày
              onChange={handleChange}
            />
          </div>
          <div className="form-section">
            <label>Instructor ID:</label>
            <input
              type="text"
              name="maGiangVien" // Ensure name matches your API
              value={courseData.maGiangVien || ''} // Sử dụng mã giảng viên từ dữ liệu
              onChange={handleChange}
              placeholder="Enter instructor ID"
            />
          </div>
          <div className="form-section">
            <label>Student Emails:</label>
            <div className="email-input-container">
              {courseData.studentEmails.map((email, index) => (
                <div key={index} className="email-tag">
                  {email} {/* Chỉ render email */}
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
          <div style={{ width: '100%' }}>
            <button type="submit" className="submit-btn">
              Update Course
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CourseForm;
