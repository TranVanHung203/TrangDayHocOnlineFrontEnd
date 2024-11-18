import React, { useState, useEffect } from 'react';
import styles from "../../css/CreateCourse.module.css"; // Import CSS module
import Header from '../../components/Header/HeaderTeacher';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho ToastContainer
import RestClient from '../../client-api/rest-client';

const restClient = new RestClient(); // Tạo instance của RestClient

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

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const result = await restClient.service('getRole').find(); // Gọi API sử dụng RestClient

        if (result.role === 'Lecturer') {
          setIsAuthorized(true); // Nếu role là Lecturer, cho phép truy cập
        } else {
          toast.error('Bạn không được phép truy cập.');
        }
      } catch (error) {
        console.error('Error fetching role:', error);
        toast.error('Không thể kiểm tra quyền truy cập.');
      }
    };

    fetchRole();
  }, []);

  if (!isAuthorized) {
    return <p style={{ color: 'red', textAlign: 'center' }}>Bạn không được phép truy cập.</p>;
  }

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

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
        toast.error('Email đã tồn tại trong danh sách sinh viên!');
      }
    }
  };

  const removeEmail = (index) => {
    const updatedEmails = courseData.emails.filter((_, i) => i !== index);
    setCourseData({
      ...courseData,
      emails: updatedEmails,
    });
    toast.info('Email đã được xóa khỏi danh sách!');
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }

    try {
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
      <div className={styles.courseForm}>
        <h2>Create Course</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <label>Course Name:</label>
            <input
              type="text"
              name="courseName"
              value={courseData.courseName}
              onChange={handleChange}
              placeholder="Enter course name"
            />
          </div>
          <div className={styles.formSection}>
            <label>Course Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={courseData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formSection}>
            <label>Description:</label>
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleChange}
              placeholder="Enter course description"
            ></textarea>
          </div>
          <div className={styles.formSection}>
            <label>Course End Date:</label>
            <input
              type="date"
              name="endDate"
              value={courseData.endDate}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formSection}>
            <label>Student Emails:</label>
            <div className={styles.emailInputContainer}>
              {courseData.emails.map((email, index) => (
                <div key={index} className={styles.emailTag}>
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
          <button type="submit" className={styles.submitBtn}>
            Create Course
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default CourseForm;
