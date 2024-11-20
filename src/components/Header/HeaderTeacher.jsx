import React from 'react';
import "../../css/HeaderTeacher.css";
import profilePic from '../../storage/logoute.png';
import logofacebook from '../../storage/logofacebook.jpg';

const Header = () => {
  const handleLogout = () => {
    // Thêm logic đăng xuất ở đây
    console.log("Đăng xuất");
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="icons-left">
          <a href="#language" className="icon globe">🌍</a>
          <a href="https://www.facebook.com/phihung633" target="_blank" rel="noopener noreferrer">
            <img src={logofacebook} alt="Không tìm thấy logo" className="icon-image" />
          </a>
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
