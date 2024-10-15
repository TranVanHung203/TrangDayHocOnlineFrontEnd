import React, { useState } from 'react';
import HeaderAdmin from '../../components/Header/HeaderAdmin';

import "../../css/CoursesOverview.css";

const CoursesOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastAccessed');

  // Giả định vai trò người dùng
  const role = 'Teacher'; // Hoặc có thể lấy từ context, props, hoặc state

  // Dữ liệu kiểm tra
  const courses = [
    {
      title: 'Các công nghệ phần mềm mới_ Nhóm 08',
      semester: '2024-2025 HỌC KỲ 1 - ĐẠI HỌC CHÍNH QUY',
      progress: '0%',
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
    },
    {
      title: 'Kiểm thử phần mềm_ Nhóm 03',
      semester: '2024-2025 HỌC KỲ 1 - ĐẠI HỌC CHÍNH QUY',
      progress: '6%',
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
    },
    {
      title: 'Chuyên đề Doanh nghiệp_ Nhóm 01',
      semester: '2024-2025 HỌC KỲ 1 - ĐẠI HỌC CHÍNH QUY',
      progress: '0%',
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
    },
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="courses-overview">
      {/* Hiển thị HeaderAdmin nếu vai trò là Teacher */}
      {role === 'Teacher' && <HeaderAdmin />}
      
      <h2>Các khóa học của tôi</h2>
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
        <button>Card</button>
      </div>
      <div className="courses-grid">
        {filteredCourses.map((course, index) => (
          <div key={index} className="course-card">
            <img src={course.imageUrl} alt={course.title} className="course-image" />
            <h3>{course.title}</h3>
            <p>{course.semester}</p>
            <p>{course.progress} complete</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesOverview;
