import React, { useState, useEffect } from 'react';
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

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const termsAndConditionsLink = 'https://example.com/terms';

  useEffect(() => {
    let timer;
    if (error || passwordError) {
      timer = setTimeout(() => {
        setError('');
        setPasswordError('');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [error, passwordError]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!agreed) {
      setError('Please agree to the terms and conditions.');
      return;
    }

    if (!name || !email || !password) {
      setError('All fields are mandatory.');
      return;
    }

    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Signup successful
        setSuccess(true);
        // Handle success, e.g., display a success message
      } else {
        // Signup failed
        const errorData = await response.json();
        console.log('Signup failed', errorData);
        if (errorData.message && errorData.message.email) {
          setError('The email has already been taken.');
        } else if (errorData.message && errorData.message.password) {
          setPasswordError('The password must be at least 8 characters.');
        } else {
          setError('Signup failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Signup failed. Please try again.');
    }
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {success && (
                <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
                  Signup successful! Click <Link href="/Login">here</Link> to login.
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                  {error}
                </Alert>
              )}
              {passwordError && (
                <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                  {passwordError}
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="agree"
                    color="primary"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                }
                label={
                  <>
                    I agree to the{' '}
                    <Link href={termsAndConditionsLink} target="_blank">
                      terms and conditions
                    </Link>
                  </>
                }
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/Login" variant="body2">
                    Already have an account? Log in
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

export default Signup;
