import React from 'react';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

const AdminButton = () => {
  return (
    <Button
      component={RouterLink}
      to="/AdminDashboard"
      sx={{ mx: 2, color: '#333' }}
    >
      Admin
    </Button>
  );
};

export default AdminButton;
