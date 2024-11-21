import { useEffect, useState } from 'react';
import './AdminLecturer.css'
import RestClient from '../../client-api/rest-client';

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho ToastContainer

function FormDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Thêm giảng viên
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        console.log(formJson);
                        const restClient = new RestClient();
                        const response = await restClient
                            .service(`admin/lecturer`)
                            .create({
                                name: formJson.name,
                                email: formJson.email,
                                password: formJson.password
                            });
                        console.log(response);
                        if (response.EC === 0) {
                            toast.success(response.EM);
                        }
                        else {
                            toast.error(response.EM);
                        }
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Giảng viên</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Nhập thông tin giảng viên
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Tên giảng viên"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="password"
                        type='password'
                        name="password"
                        label="Mật khẩu"
                        fullWidth
                        variant="standard"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Thoát</Button>
                    <Button type="submit">Đăng ký</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}



const AdminLecturer = () => {
    const [listLecturer, setListLecturer] = useState([]);

    useEffect(() => {

        const fetchListLecturer = async () => {
            const restClient = new RestClient();
            const response = await restClient
                .service(`admin/lecturer`)
                .find();
            setListLecturer(response);
        }
        fetchListLecturer();
    })

    return (
        <div className='admin-lecturer-container'>
            <FormDialog />

            <table>
                <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                </tr>
                {listLecturer && listLecturer.length > 0 && listLecturer.map((lecturer) => {
                    return (
                        <tr key={lecturer._id}>
                            <td>{lecturer.name}</td>
                            <td>{lecturer.email}</td>
                            <td>{lecturer.role}</td>
                        </tr>
                    )
                })}

            </table>
            <ToastContainer />
        </div>
    )
}

export default AdminLecturer;