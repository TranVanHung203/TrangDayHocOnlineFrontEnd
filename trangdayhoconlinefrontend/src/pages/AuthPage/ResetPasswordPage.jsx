import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import RestClient from "../../client-api/rest-client";
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho ToastContainer

const ResetPasswordPage = (props) => {
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const { reset_token } = useParams();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (passwordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        console.log({
            password: data.get('password'),
        });
        const restClient = new RestClient();
        const response = await restClient
            .service('reset-password') // Đặt đường dẫn API
            .patch({
                token: reset_token,
                password: data.get('password')
            });
        if (response.EC === 0) {
            toast.success(response.EM);
        }
        else {
            toast.error(response.EM);
        }
    };

    const validateInputs = () => {
        const password = document.getElementById('password');

        let isValid = true;

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <div>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 2,
                }}
            >
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                    </Box>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={validateInputs}
                >
                    Reset Password
                </Button>
            </Box>
            <ToastContainer />
        </div>
    )
}

export default ResetPasswordPage;