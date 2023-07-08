import { Grid, Card, CardContent, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { format } from 'date-fns';

function DonateFood() {
    
    const navigate = useNavigate();
    
    const [numberOfPlates, setNumberOfPlates] = useState('');
    const [location, setLocation] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const [price, setPrice] = useState('');
    const [expiryInDays, setExpiryInDays] = useState('');
    const [foodType, setFoodType] = useState('veg');
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [preparedDate, setPreparedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [status, setStatus] = useState('active');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');

  
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            // Handle unauthenticated state
            return;
          }
          
          const foodData = {
            number_of_plates: numberOfPlates,
            location,
            delivery_status: deliveryStatus,
            price,
            expiry_in_days: expiryInDays,
            food_type: foodType,
            event_name: eventName,
            description,
            prepared_date: preparedDate,
            status,
          };
          
          const response = await axios.post('http://localhost:8000/api/addfood', foodData, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          setMessage(response.data.message);
          setMessageType('success');
            // Clear the message after 3 seconds
            setTimeout(() => {
              setMessage('');
              setMessageType('');
            }, 3000);
          if (response.status === 200) {
            console.log("success", response);
          } else {
            setMessage(response.data.message);
          setMessageType('error');
            // Clear the message after 3 seconds
            setTimeout(() => {
              setMessage('');
              setMessageType('');
            }, 3000);
            console.error('Error:', response);
          }
        } catch (error) {
          let errorMessage;
        if (typeof error.response.data.message === 'object') {
            errorMessage = Object.values(error.response.data.message).join(' ');
        } else {
            errorMessage = error.response.data.message;
        }
        setMessage(errorMessage);
        setMessageType('error');
          // Clear the message after 3 seconds
          setTimeout(() => {
            setMessage('');
            setMessageType('');
          }, 3000);
      };
      
    }
  return (
    <div style={{ marginTop: '20px', padding: '30px' }}>
      <h1 className='text-center'>Add Food details here</h1>
      <Card>
      {message && (
        <Alert severity={messageType}>
          {message}
        </Alert>
      )}
        <CardContent>
        
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Number of Plates" name="numberOfPlates" type="number" variant="outlined" value={numberOfPlates} onChange={(e) => setNumberOfPlates(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Location" name="location" variant="outlined" onChange={(e) => setLocation(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Delivery Status" name="deliveryStatus" variant="outlined" onChange={(e) => setDeliveryStatus(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Price" name="price" type="number" variant="outlined" onChange={(e) => setPrice(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Expiry in Days" name="expiryInDays" type="number" variant="outlined" onChange={(e) => setExpiryInDays(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined"  required>
                  <InputLabel id="foodType-label">Food Type</InputLabel>
                  <Select
                    labelId="foodType-label"
                    id="foodType"
                    label="Food Type"
                    name="foodType"
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)} 
                  >
                    <MenuItem value="veg">Veg</MenuItem>
                    <MenuItem value="non_veg">Non-Veg</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Event Name" name="eventName" variant="outlined" onChange={(e) => setEventName(e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Prepared Date" name="preparedDate" type="date"  value={preparedDate}  onChange={(e) => setPreparedDate(e.target.value)} InputLabelProps={{ shrink: true }} variant="outlined" required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined"   required>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    label="Status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="deactive">Deactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Description" name="description" variant="outlined" onChange={(e) => setDescription(e.target.value)} multiline rows={4} required />
              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
            <Button style={{ marginTop: '20px' }} variant="contained"sx={{ mr: 5, width: 200 }} color="primary" type="submit">
              Upload
            </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default DonateFood;
