import React from 'react';
import "../../css/Header.css";
import profilePic from '../../storage/logoute.png';
import logofacebook from '../../storage/logofacebook.jpg';

const Header = () => {
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
          <div className="profile">
            <img src="https://scontent.fhan3-4.fna.fbcdn.net/v/t1.6435-9/132942339_863699217783212_1007212389937628113_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=-liykHQH3ZcQ7kNvgG-DwZb&_nc_ht=scontent.fhan3-4.fna&_nc_gid=Azxyy3bcAw8mYWJX80LnQ4u&oh=00_AYB0tY-_Yl_txEKh-OvOJof17oG9qPjyBYtz55f7hvJGdQ&oe=67355D61" alt="Profile" className="profile-pic" />
          </div>
        </div>
      </div>
      <div className="header-bottom">
        <div className="logo">
          <img src={profilePic} alt="Không tìm thấy logo" className="logo" />
        </div>
        <nav className="nav-links">
          <a href="/homepage">Trang chủ</a>
          <a href="/createcourse">Tạo khóa học mới</a>
          <a href="/mycourses">Các khoá học của tôi</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
