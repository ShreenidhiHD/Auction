import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const SellButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/listitem");
    }

    return (
        <Button  color="inherit"  onClick={handleClick}>
            Create Auction
        </Button>
    );
}

export default SellButton;
