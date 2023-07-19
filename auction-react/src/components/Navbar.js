import React, { useContext, useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { SettingsContext } from '../server/SettingsProvider';
import Logout from './Logout';
import SellButton from './SellButton';
import DashboardButton from './DashboardButton';
import AdminButton from './AdminButton';


const ResponsiveAppBar = () => {
  const settings = useContext(SettingsContext);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('authToken') !== null);
  const [userRole, setUserRole] = useState(null);
  const restrictedRoutes = ['/login', '/signup', '/'];
  const restrictedPages = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Login', path: '/login' },
    { name: 'Signup', path: '/signup' },
  ];

  const unrestrictedPages = [
    { name: 'Home', path: '/UserHome' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Profile', path: '/UserProfile' },
   
  ];

  const getUserRole = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/user-role`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUserRole(data.message); // assuming response is an object containing a 'role' property

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getUserRole();
    }
  }, [isLoggedIn]);
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const renderPages = (pages) => {
    return pages.map((page) => (
      <Button
        key={page.name}
        component={RouterLink}
        to={page.path}
        sx={{ mx: 2, color: 'white' }}
      >
        {page.name}
      </Button>
    ));
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#292F36', color: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to={isLoggedIn ? "/UserHome" : "/"}
            sx={{
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {settings?.appName}
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {isLoggedIn ? renderPages(unrestrictedPages) : renderPages(restrictedPages)}

            {/* {restrictedRoutes.includes(location.pathname) ? renderPages(restrictedPages) : renderPages(unrestrictedPages)} */}
          </Box>
          {isLoggedIn && !restrictedRoutes.includes(location.pathname) && (
        <>
          {userRole === 'admin' && <AdminButton/>} {/* hypothetical AdminButton component */}
          <DashboardButton/>
          {userRole !== 'charity' && <SellButton/>}
          <Logout onLogout={handleLogout} />
        </>
      )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
