import { useEffect, useState } from 'react';
import './AdminStudent.css'
import RestClient from '../../client-api/rest-client';

const AdminStudent = () => {
    const [listStudent, setListStudent] = useState([]);
    useEffect(() => {

        const fetchListStudent = async () => {
            const restClient = new RestClient();
            const response = await restClient
                .service(`admin/student`)
                .find();
            setListStudent(response);
        }
        fetchListStudent();
    }, [])

    return (
        
        <div className='admin-student-container'>
            <table>
                <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                </tr>
                {listStudent && listStudent.length > 0 && listStudent.map((student) => {
                    return (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.role}</td>
                        </tr>
                    )
                })}

            </table>
        </div>
    )
}

export default AdminStudent;