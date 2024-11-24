import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    return (
        <div className='admin-page-container'>
            <Sidebar rootStyles={{
                [`.${sidebarClasses.container}`]: {
                    height: '710px'
                }
            }}>
                <Menu>
                    <SubMenu label="Người dùng">
                        <MenuItem component={<Link to="/admin/student" />}> Sinh viên </MenuItem>
                        <MenuItem component={<Link to="/admin/lecturer" />}> Giảng viên </MenuItem>
                    </SubMenu>
                    <MenuItem component={<Link to="/admin/admins" />}> Admin </MenuItem>
                </Menu>
            </Sidebar>

            <Outlet /> {/* Đây là nơi các trang con sẽ được hiển thị */}
        </div>
    )
}

export default AdminPage;