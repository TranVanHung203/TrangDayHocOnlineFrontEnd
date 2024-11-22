import { useEffect, useState } from 'react';
import './Admin.css'
import RestClient from '../../client-api/rest-client';

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

    return (
        <div className='admin-container'>
            <table>
                <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                </tr>
                {listAdmin && listAdmin.length > 0 && listAdmin.map((admin) => {
                    return (
                        <tr key={admin._id}>
                            <td>{admin.name}</td>
                            <td>{admin.email}</td>
                            <td>{admin.role}</td>
                        </tr>
                    )
                })}

            </table>
        </div>
    )
}

export default Admin;