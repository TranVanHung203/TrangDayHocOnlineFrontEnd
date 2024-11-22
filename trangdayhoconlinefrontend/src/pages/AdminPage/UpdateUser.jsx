import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import RestClient from '../../client-api/rest-client';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho ToastContainer

function UpdateUser(props) {

    const [open, setOpen] = React.useState(false);
    const { id, name, email, role, verify_email } = props;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Sửa {(role === 'Student') ? "Sinh viên" : (role === 'Lecturer') ? "Giảng viên" : "Admin"}
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
                            .service(`admin/`)
                            .patch({
                                id: id,
                                name: formJson.name,
                                email: formJson.email,
                                role: formJson.role,
                                is_verify_email: formJson.verify_email
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
                <DialogTitle>Sửa {(role === 'Student') ? "Sinh viên" : (role === 'Lecturer') ? "Giảng viên" : "Admin"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Nhập thông tin {role}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        placeholder={email}
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
                        placeholder={name}
                        id="name"
                        name="name"
                        label="Tên giảng viên"
                        fullWidth
                        variant="standard"
                    />

                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Vai trò</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue={role}
                            name="role"
                        >
                            <FormControlLabel value="Student" control={<Radio />} label="Sinh viên" />
                            <FormControlLabel value="Lecturer" control={<Radio />} label="Giảng viên" />
                            <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
                        </RadioGroup>
                    </FormControl>

                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Xác thực email</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue={verify_email}
                            name="verify_email"
                        >
                            <FormControlLabel value={true} control={<Radio />} label="True" />
                            <FormControlLabel value={false} control={<Radio />} label="False" />
                        </RadioGroup>
                    </FormControl>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Thoát</Button>
                    <Button type="submit">Sửa</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default UpdateUser;