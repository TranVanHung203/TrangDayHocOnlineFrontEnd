import { useEffect, useState } from 'react';
import './AdminStudent.css'
import RestClient from '../../client-api/rest-client';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho ToastContainer
import UpdateUser from './UpdateUser';

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

    const deleteStudent = async (idStudent) => {
        const restClient = new RestClient();
        const response = await restClient
            .service(`admin/${idStudent}`)
            .delete();
        console.log(response);
        if (response.EC === 0) {
            const response1 = await restClient
                .service(`admin/student`)
                .find();
            setListStudent(response1);
            toast.success(response.EM);
        }
        else {
            toast.error(response.EM);
        }
    }

    return (

        <div className='admin-student-container'>
            <table>
                <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Xác thực email</th>
                    <th>Sửa</th>
                    <th>Xóa</th>
                </tr>
                {listStudent && listStudent.length > 0 && listStudent.map((student) => {
                    return (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.role}</td>
                            <td>{student.is_verify_email ? "True" : "False"}</td>
                            <td>
                                <UpdateUser
                                    id={student._id}
                                    name={student.name}
                                    email={student.email}
                                    role={student.role}
                                    verify_email={student.is_verify_email} /></td>
                            <td><button onClick={() => deleteStudent(student._id)}>XÓA SINH VIÊN</button></td>
                        </tr>
                    )
                })}

            </table>
            <ToastContainer />
        </div>
    )
}

export default AdminStudent;