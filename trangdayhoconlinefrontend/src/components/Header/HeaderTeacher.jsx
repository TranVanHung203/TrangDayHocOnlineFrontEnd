import React, { useEffect, useState } from 'react';
import "../../css/HeaderTeacher.css";
import profilePic from '../../storage/logoute.png';


const Header = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    // Lấy giá trị 'name' từ localStorage
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, []);
  const handleLogout = () => {
    window.location.href = "/logout";  // Chuyển hướng đến trang /logout
  };

  return (
    <header className="header">
      <div className="header-top">
      <div className="icons-left">
          {name ? (
            <span className="welcome-message">Xin chào, <strong>{name}</strong>!</span>
          ) : (
            <span className="welcome-message">Xin chào!</span>
          )}
        </div>
        <div className="ute-online-learning">
          UTE ONLINE LEARNING
        </div>
        <div className="icons-right">
          <button onClick={handleLogout} className="logout-button">
            <img src="https://i.pinimg.com/474x/79/f4/32/79f4326b51bbfa58b713a65790e0b836.jpg" alt="Profile" className="profile-pic" />
            <span className="logout-text">Đăng xuất</span>
          </button>
        </div>
      </div>
      <div className="header-bottom">
        <div className="logo">
          <img src={profilePic} alt="Không tìm thấy logo" className="logo" />
        </div>
        <nav className="nav-links">
          <a href="/mycourses">Các khoá học của tôi</a>
          <a href="/createcourse">Tạo khóa học mới</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
