import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, Outlet } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    return (
        <div className='admin-container'>
            <Sidebar>
                <Menu>
                    <SubMenu label="Người dùng">
                        <MenuItem component={<Link to="/admin/student" />}> Sinh viên </MenuItem>
                        <MenuItem component={<Link to="/admin/lecturer" />}> Giảng viên </MenuItem>
                    </SubMenu>
                    <MenuItem component={<Link to="/admin/admins" />}> Admin </MenuItem>
                </Menu>
            </Sidebar>

            <div className="content">
                <Outlet /> {/* Đây là nơi các trang con sẽ được hiển thị */}
            </div>
        </div>
    )
}

export default AdminPage;