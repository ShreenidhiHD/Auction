import React, { useState } from 'react';
import { Button, TextField, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import {Card, CardContent } from '@mui/material';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/reset-password', { email });
      if (response.data.message==='Password reset and email sent successfully.') {

        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || 'failed to send email');
      }
    } catch (error) {
        if (error.response) {
            toast.error('Failed ' + error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            toast.error('Failed : No response from server');
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            toast.error('Failed: ' + error.message);
          }
    }
  };

  return (
    <Container component="main" maxWidth="xs"  sx={{ marginTop: '2rem' }}>
        <Card>
            <CardContent>
      <Typography component="h1" variant="h5" sx={{ marginBottom: '2rem' }}>
        Forget Password
      </Typography>
      <form onSubmit={handleFormSubmit} sx={{ marginTop: '2rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Password Reset
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer position="top-center" />
      </CardContent>
      </Card>
    </Container>
  );
};

export default ForgetPassword;
