import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const DashboardButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/dashboard");
    }

    return (
        <Button  color="inherit"  onClick={handleClick}>
            Dashboard
        </Button>
    );
}

export default DashboardButton;
