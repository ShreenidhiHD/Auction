import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const DonateButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/donatefood");
    }

    return (
        <Button  color="inherit"  onClick={handleClick}>
            Donate
        </Button>
    );
}

export default DonateButton;
