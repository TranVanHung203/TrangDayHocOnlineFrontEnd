import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RestClient from '../../client-api/rest-client.js';
import HeaderTeacher from '../../components/Header/HeaderTeacher';
import HeaderStudent from '../../components/Header/HeaderStudent';
import "../../css/CoursesOverview.css";
import editlogo from '../../storage/edit.png';

const DEFAULT_IMAGE_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhk12AaBiZxtAClRZQ_N0Bm6mIB6RAJHOJ5A&s';
const client = new RestClient().service('courses');

const CoursesOverview = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() =>
    localStorage.getItem('itemsPerPage') ? parseInt(localStorage.getItem('itemsPerPage'), 10) : 9
  );
  const [courses, setCourses] = useState([]);
  const [role, setRole] = useState('');
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = useCallback(async (page, limit) => {
    try {
      const data = await client.find({ page, limit });
      setRole(data.role);
      setTotalCourses(data.totalCourses);
      setTotalPages(data.totalPages);

      const formattedCourses = data.courses.map(course => ({
        ...course,
        tenKhoaHoc: course.name,
        moTa: course.description,
        maKhoaHoc: course._id,
        imageUrl: DEFAULT_IMAGE_URL,
      }));
      setCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, []);

  useEffect(() => {
    fetchCourses(currentPage, itemsPerPage);
  }, [fetchCourses, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    localStorage.setItem('itemsPerPage', newItemsPerPage);
  };

  const filteredCourses = courses.filter(course =>
    course.tenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm chuyển hướng đến trang chi tiết khóa học
  const handleCourseClick = (maKhoaHoc) => {
    navigate(`/mycourses/coursedetails/${maKhoaHoc}`);
  };

  // Hàm chuyển hướng đến trang chỉnh sửa khóa học
  const handleEditClick = (maKhoaHoc, event) => {
    event.stopPropagation(); // Ngăn sự kiện click vào thẻ khóa học
    navigate(`/updatecourses/load-course/${maKhoaHoc}`);
  };

  return (
    <div className="courses-overview">
      {role === 'Lecturer' ? <HeaderTeacher /> : <HeaderStudent />}

      <h2>Các khóa học hiện tại</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value="3">3 items per page</option>
          <option value="6">6 items per page</option>
          <option value="9">9 items per page</option>
        </select>
      </div>
      <div className="courses-grid">
        {filteredCourses.map((course, index) => (
          <div
            key={index}
            className="course-card"
            onClick={() => handleCourseClick(course.maKhoaHoc)} // Nhấn vào thẻ sẽ vào trang chi tiết
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <img src={course.imageUrl} alt={course.tenKhoaHoc} className="course-image" />
            <h3>{course.tenKhoaHoc}</h3>
            <p>{course.moTa}</p>
            {role === 'Lecturer' && (
              <button
                className="edit-icon"
                onClick={(event) => handleEditClick(course.maKhoaHoc, event)} // Nhấn vào biểu tượng Edit sẽ vào trang chỉnh sửa
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <img src={editlogo} alt="Edit" className="logo" style={{ width: '24px', height: '24px', marginTop: '4px' }} />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CoursesOverview;
