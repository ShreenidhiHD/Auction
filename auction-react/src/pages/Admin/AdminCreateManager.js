import React from 'react';
import CreateManager from '../../components/CreateManager';
import { Box } from '@mui/material';

const AdminCreateManager = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="500px"
      margin="0 auto"
    >
      <CreateManager />
    </Box>
  );
}

export default AdminCreateManager;
