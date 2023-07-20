import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const CreateManager = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleInputChange = (event, setState) => {
      setState(event.target.value);
    };

    const submitForm = async (event) => {
        event.preventDefault();
      
        const managerData = {
          name,
          email,
        };
      
        try {
          const authToken = localStorage.getItem('authToken');
      
          const response = await axios.post(
            'http://localhost:8000/api/admin/create_manager',
            managerData,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
      
          // If successful, show a success toast
          toast.success('Manager created successfully');
      
        } catch (error) {
          // handle error response
          console.log(error);
          // If an error occurred, show an error toast
          toast.error('Failed to create manager');
        }
      };
      
    return (
        <Card sx={{ width: '100%', padding: '2rem' }}>
            <CardContent>
                <h2 className="text-center mb-4">Create Manager</h2>
                <form onSubmit={submitForm} autoComplete="off">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="Name" variant="outlined" value={name} onChange={(event) => handleInputChange(event, setName)} fullWidth required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Email" variant="outlined" value={email} onChange={(event) => handleInputChange(event, setEmail)} fullWidth required />
                        </Grid>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button type="submit" variant="contained" color="primary" sx={{ mr: 5, width: 200 }}>Submit</Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
            <ToastContainer position="top-center" />
        </Card>
    );
};

export default CreateManager;
