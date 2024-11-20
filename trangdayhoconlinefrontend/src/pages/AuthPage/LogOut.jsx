import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestClient from '../../client-api/rest-client.js';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const restClient = new RestClient(); // Create the RestClient instance here
        const handleLogout = async () => {
            try {
                await restClient.service('logout').find();
                // Redirect to login page after successful logout
                navigate('/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        handleLogout();
    }, [navigate]); // Ensure dependencies only include `navigate`

    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
            <h2>Logging out...</h2>
        </div>
    );
};

export default Logout;