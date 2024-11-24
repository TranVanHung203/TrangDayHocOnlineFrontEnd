import { useEffect, useState } from 'react';
import './Admin.css'
import RestClient from '../../client-api/rest-client';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho ToastContainer
import UpdateUser from './UpdateUser';

const Admin = () => {
    const [listAdmin, setListAdmin] = useState([]);
    useEffect(() => {
        const fetchListAdmin = async () => {
            const restClient = new RestClient();
            const response = await restClient
                .service(`admin/admin`)
                .find();
            setListAdmin(response);
        }
        fetchListAdmin();
    }, [])

    const deleteAdmin = async (idAdmin) => {
        const restClient = new RestClient();
        const response = await restClient
            .service(`admin/${idAdmin}`)
            .delete();
        console.log(response);
        if (response.EC === 0) {
            const response1 = await restClient
                .service(`admin/lecturer`)
                .find();
            setListAdmin(response1);
            toast.success(response.EM);
        }
        else {
            toast.error(response.EM);
        }
    }

    return (
        <div className='admin-container'>
            <table>
                <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Xác thực email</th>
                    <th>Sửa</th>
                    <th>Xóa</th>
                </tr>
                {listAdmin && listAdmin.length > 0 && listAdmin.map((admin) => {
                    return (
                        <tr key={admin._id}>
                            <td>{admin.name}</td>
                            <td>{admin.email}</td>
                            <td>{admin.role}</td>
                            <td>{admin.is_verify_email ? "True" : "False"}</td>
                            <td><UpdateUser
                                id={admin._id}
                                name={admin.name}
                                email={admin.email}
                                role={admin.role}
                                verify_email={admin.is_verify_email} /></td>
                            <td><button onClick={() => deleteAdmin(admin._id)}>XÓA ADMIN</button></td>
                        </tr>
                    )
                })}

            </table>
            <ToastContainer />
        </div>
    )
}

export default Admin;