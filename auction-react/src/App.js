import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AuthenticatedRoute from './utils/AuthenticatedRoute';
import Home from './pages/Home';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserHome from './pages/User/UserHome';
import UserProfile from './pages/User/UserProfile';
import ListItem from './pages/User/ListItem';
import Dashboard from './pages/User/Dashboard';
import SettingsProvider from './server/SettingsProvider';
import UserDonations from './pages/User/UserDonations';
import Navbar from './components/Navbar';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WithNavbar><Home /></WithNavbar>} />
          <Route path="/about" element={<WithNavbar><About /></WithNavbar>} />
          <Route path="/categories" element={<WithNavbar><Categories /></WithNavbar>} />
          <Route path="/contact" element={<WithNavbar><Contact /></WithNavbar>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userhome" element={<AuthenticatedRoute><WithNavbar><UserHome /></WithNavbar></AuthenticatedRoute>} />
          <Route path="/userprofile" element={<AuthenticatedRoute><WithNavbar><UserProfile /></WithNavbar></AuthenticatedRoute>} />
          <Route path="/listitem" element={<AuthenticatedRoute><WithNavbar><ListItem /></WithNavbar></AuthenticatedRoute>} />
          <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard /></AuthenticatedRoute>} />
          <Route path="/userdonations" element={<AuthenticatedRoute><UserDonations /></AuthenticatedRoute>} />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

function WithNavbar({ children }) {
  const location = useLocation();
  const hideNavbarRoutes = ['/dashboard', '/userdonations']; // Add the routes where you want to hide the navbar

  if (hideNavbarRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default App;
