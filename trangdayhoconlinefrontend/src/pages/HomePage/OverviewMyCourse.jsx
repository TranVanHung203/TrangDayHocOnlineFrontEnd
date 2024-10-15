import React, { useState } from 'react';
import HeaderAdmin from '../../components/Header/HeaderTeacher';
import "../../css/CoursesOverview.css";
import editlogo from '../../storage/edit.png';

const CoursesOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastAccessed');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Giả định vai trò người dùng và ID người dùng hiện tại
  const role = 'Teacher';
  const currentUserId = 'giangVien1'; // ID của người dùng đang đăng nhập

  // Dữ liệu kiểm tra
  const courses = [
    {
      tenKhoaHoc: 'Khóa học lập trình JavaScript',
      moTa: 'Khóa học cơ bản về JavaScript cho người mới bắt đầu.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu1', 'taiLieu2'],
      quizzes: ['quiz1'],
      enrolledUsers: ['user1', 'user2'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '50%'
    },
    {
      tenKhoaHoc: 'Khóa học lập trình Python',
      moTa: 'Khóa học cơ bản về Python cho người mới bắt đầu.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu3', 'taiLieu4'],
      quizzes: ['quiz2'],
      enrolledUsers: ['user1'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '30%'
    },
    {
      tenKhoaHoc: 'Khóa học thiết kế web',
      moTa: 'Khóa học về thiết kế giao diện web với HTML và CSS.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu5', 'taiLieu6'],
      quizzes: ['quiz3'],
      enrolledUsers: ['user2', 'user3'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '70%'
    },
    {
      tenKhoaHoc: 'Khóa học thiết kế web',
      moTa: 'Khóa học về thiết kế giao diện web với HTML và CSS.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu5', 'taiLieu6'],
      quizzes: ['quiz3'],
      enrolledUsers: ['user2', 'user3'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '70%'
    },
    {
      tenKhoaHoc: 'Khóa học thiết kế web',
      moTa: 'Khóa học về thiết kế giao diện web với HTML và CSS.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu5', 'taiLieu6'],
      quizzes: ['quiz3'],
      enrolledUsers: ['user2', 'user3'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '70%'
    },
    {
      tenKhoaHoc: 'Khóa học thiết kế web',
      moTa: 'Khóa học về thiết kế giao diện web với HTML và CSS.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu5', 'taiLieu6'],
      quizzes: ['quiz3'],
      enrolledUsers: ['user2', 'user3'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '70%'
    },
    {
      tenKhoaHoc: 'Khóa học thiết kế web',
      moTa: 'Khóa học về thiết kế giao diện web với HTML và CSS.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu5', 'taiLieu6'],
      quizzes: ['quiz3'],
      enrolledUsers: ['user2', 'user3'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '70%'
    },
    {
      tenKhoaHoc: 'Khóa học thiết kế web',
      moTa: 'Khóa học về thiết kế giao diện web với HTML và CSS.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu5', 'taiLieu6'],
      quizzes: ['quiz3'],
      enrolledUsers: ['user2', 'user3'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '70%'
    },
    {
      tenKhoaHoc: 'Khóa học thiết kế web',
      moTa: 'Khóa học về thiết kế giao diện web với HTML và CSS.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu5', 'taiLieu6'],
      quizzes: ['quiz3'],
      enrolledUsers: ['user2', 'user3'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '70%'
    },
    {
      tenKhoaHoc: 'Khóa học thiết kế web',
      moTa: 'Khóa học về thiết kế giao diện web với HTML và CSS.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu5', 'taiLieu6'],
      quizzes: ['quiz3'],
      enrolledUsers: ['user2', 'user3'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '70%'
    },
    {
      tenKhoaHoc: 'Khóa học thiết kế web',
      moTa: 'Khóa học về thiết kế giao diện web với HTML và CSS.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu5', 'taiLieu6'],
      quizzes: ['quiz3'],
      enrolledUsers: ['user2', 'user3'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '70%'
    },
    {
      tenKhoaHoc: 'Khóa học thiết kế web',
      moTa: 'Khóa học về thiết kế giao diện web với HTML và CSS.',
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(new Date().getTime() + 604800000), // 1 tuần sau
      maGiangVien: 'giangVien1',
      taiLieu: ['taiLieu5', 'taiLieu6'],
      quizzes: ['quiz3'],
      enrolledUsers: ['user2', 'user3'],
      imageUrl: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-6/270630319_646138706802110_9013562198811924589_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=DkGq1qGHV98Q7kNvgHX_aAK&_nc_ht=scontent.fhan4-1.fna&_nc_gid=AnN9nDnDG0-hxZUJ2df9hAO&oh=00_AYDdnCBav0Xlqq3UsCBNGaHqDdhiLjfp-DLIhmBkumammg&oe=6713D990',
      progress: '70%'
    }
    
  ];

  const filteredCourses = courses.filter(course =>
    course.tenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán số trang
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="courses-overview">
      {role === 'Teacher' && <HeaderAdmin />}
      
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
            <p>{course.progress} complete</p>
            {/* Kiểm tra xem người dùng có trong danh sách enrolledUsers không */}
            {course.maGiangVien.includes(currentUserId) && (
              <button 
                className="edit-icon" 
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer' 
                }}
                onClick={() => alert('Edit course')} // Thay đổi hành động tùy ý
              >
                {/* Hình ảnh cây bút */}
             
                  <img src={editlogo} alt="Không tìm thấy logo" className="logo" style={{ width: '24px', height: '24px' ,marginTop: '4px'}} />
               
                  
                
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
