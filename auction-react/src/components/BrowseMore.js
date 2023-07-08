import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';

const BrowseMore = ({ isAuthenticated }) => {
  const buttonStyle = {
    marginTop: '50px',
  };
   isAuthenticated = localStorage.getItem('authToken') !== null;
  
  if (isAuthenticated) {
    // User is logged in, show the browse more button with blue color
    return (
      <Button
        component={RouterLink}
        to="/browse"
        variant="contained"
        color="primary"
        style={buttonStyle}
      >
        Browse More
      </Button>
    );
  } else {
    // User is not logged in, show the login link with pink color
    return (
      <Button
        component={RouterLink}
        to="/login"
        variant="contained"
        color="secondary"
        style={buttonStyle}
      >
        Login to Browse More
      </Button>
    );
  }
};

export default BrowseMore;
