import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { SettingsContext } from '../server/SettingsProvider';
import Logout from './Logout';
import DonateButton from './DonateButton';
import DashboardButton from './DashboardButton';

// Array of pages to be displayed in the navigation bar


// The ResponsiveAppBar component is a responsive navigation bar that provides navigation between different pages of the application. 
// It also displays the application name fetched from the SettingsContext. 
// Depending on the user's authentication status, it either displays a logout button and a link to the profile page or login and signup buttons.
const ResponsiveAppBar = () => {
  const settings = useContext(SettingsContext); // Get settings from SettingsContext
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('authToken') !== null); // Check if the user is logged in

  const pages = [
    isLoggedIn ? { name: 'Home', path: '/UserHome' } : { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];
  // Handle logout by setting isLoggedIn state to false
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#f8f8f8', color: '#333' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {settings?.appName} {/* Display the app name */}
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                sx={{ mx: 2, color: '#333' }}
              >
                {page.name} {/* Display the page name */}
              </Button>
            ))}
          </Box>
          {isLoggedIn ? (
            <>
              <DashboardButton/>
              <DonateButton/>
              <Button component={RouterLink} to="/userprofile" color="inherit">
                Profile
              </Button>
              <Logout onLogout={handleLogout} /> {/* Display the Logout button if the user is logged in */}
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" color="inherit">
                Login
              </Button>
              <Button component={RouterLink} to="/signup" color="inherit">
                Signup
              </Button> {/* Display the Login and Signup buttons if the user is not logged in */}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
