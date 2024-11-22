import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Logic để xử lý logout (nếu có)
        navigate('/logout'); // Điều hướng tới /logout
    };

    return (
        <div className='admin-page-container'>
            <Sidebar>
                <Menu>
                    <SubMenu label="Người dùng">
                        <MenuItem component={<Link to="/admin/student" />}> Sinh viên </MenuItem>
                        <MenuItem component={<Link to="/admin/lecturer" />}> Giảng viên </MenuItem>
                    </SubMenu>
                    <MenuItem component={<Link to="/admin/admins" />}> Admin </MenuItem>
                    <MenuItem onClick={handleLogout}> Đăng xuất </MenuItem>
                </Menu>
            </Sidebar>

            <Outlet /> {/* Đây là nơi các trang con sẽ được hiển thị */}
        </div>
    );
};

export default AdminPage;
