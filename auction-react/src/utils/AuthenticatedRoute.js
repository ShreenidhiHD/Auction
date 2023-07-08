import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AuthenticatedRoute({ children }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

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

    // Check validation when component mounts
    validateToken();

    // Set up interval to validate every minute
    const interval = setInterval(validateToken, 60000); // 60000 milliseconds = 1 minute

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

export default AuthenticatedRoute;
