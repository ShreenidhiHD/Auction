import React from 'react';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

const ManagerButton = () => {
  return (
    <Button
      component={RouterLink}
      to="/AssignedTasks"
      sx={{ mx: 2, color: 'white' }}
    >
      Manager
    </Button>
  );
};

export default ManagerButton;
