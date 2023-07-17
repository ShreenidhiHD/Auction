import * as React from 'react';
import { useState } from 'react'; // Don't forget to import useState!
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
async function loginUser(email, password, setLoginError, setErrorMessage) {
  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });
    
const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
    
    const token = data.token;
    localStorage.setItem('authToken', token);
    if (response.status === 201) {
      console.log(`User logged in`);
      // Redirect to userhome.js
      window.location.href = 'UserHome';
    }
    
  } catch (error) {
    let message = 'Login failed. Please try again later.';
    if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        message = 'Failed: No response from server';
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        message = 'Failed: ' + error.message;
    }
    console.error('Error during login:', error);
    setErrorMessage(message);
    setLoginError(true);
    setTimeout(() => {
      setLoginError(false);
      setErrorMessage(''); // clear the error message after 5 seconds
    }, 5000); // Remove error message after 5 seconds
}


}

export default function SignInSide() {
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // add errorMessage state here

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    loginUser(data.get('email'), data.get('password'), setLoginError, setErrorMessage);  // pass setErrorMessage here
  };
  return (
    <ThemeProvider theme={createTheme()}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            {loginError && (
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                  {errorMessage}
              </Alert>
          )}

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/ForgetPassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/Signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
