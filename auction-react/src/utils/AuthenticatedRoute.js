import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AuthenticatedRoute({ children, skipProfileCheck = false }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/validate-token', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.status !== 200) {
          setIsLoggedIn(false);
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
      }
    };

    const checkProfileCompletion = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/is-profile-complete', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        setIsProfileComplete(response.data.isComplete);
      } catch (error) {
        console.error('Error checking profile completion:', error);
      }
    };

    const fetchData = async () => {
      await validateToken();
      if (isLoggedIn && !skipProfileCheck) {
        await checkProfileCompletion();
      }
      setIsLoading(false);
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [isLoggedIn, skipProfileCheck]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!isProfileComplete && !skipProfileCheck) {
    return <Navigate to="/completeprofile" state={{ from: location }} />;
  }

  return children;
}

export default AuthenticatedRoute;
