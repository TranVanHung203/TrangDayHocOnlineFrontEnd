import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RestClient from '../../client-api/rest-client.js';
import HeaderTeacher from '../../components/Header/HeaderTeacher';
import HeaderStudent from '../../components/Header/HeaderStudent';
import "../../css/CoursesOverview.css";
import editlogo from '../../storage/edit.png';

const DEFAULT_IMAGE_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhk12AaBiZxtAClRZQ_N0Bm6mIB6RAJHOJ5A&s';

// Khởi tạo RestClient bên ngoài component để không tạo lại mỗi lần render
const client = new RestClient().service('courses');

const CoursesOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastAccessed');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [courses, setCourses] = useState([]);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const currentUserId = 'giangVien1';

  const fetchCourses = useCallback(async () => {
    try {
      const data = await client.find(); // Gọi API một lần khi component load
      setRole(data.role);

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
    fetchCourses(); // Chỉ gọi một lần khi component được mount
  }, [fetchCourses]);

  const filteredCourses = courses.filter(course =>
    course.tenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  const handleEditClick = (maKhoaHoc) => {
    navigate(`/updatecourses/load-course/${maKhoaHoc}`);
  };

  return (
    <div className="courses-overview">
      {role === 'Lecturer' ? <HeaderTeacher /> : <HeaderStudent />}

      <h2>Các khóa học hiện tại</h2>
      <div className="filters">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="lastAccessed">Sort by last accessed</option>
          <option value="progress">Sort by progress</option>
        </select>
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="courses-grid">
        {currentCourses.map((course, index) => (
          <div key={index} className="course-card" style={{ position: 'relative' }}>
            <img src={course.imageUrl} alt={course.tenKhoaHoc} className="course-image" />
            <h3>{course.tenKhoaHoc}</h3>
            <p>{course.moTa}</p>
            {course.maGiangVien === currentUserId && (
              <button
                className="edit-icon"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => handleEditClick(course.maKhoaHoc)}
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
