import { Grid, Typography, Card, CardContent, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { parse, format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';



function UpdateAuction() {
    const [auctionName, setAuctionName] = useState('');
    const [productName, setProductName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startPrice, setStartPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productCertification, setProductCertification] = useState('');
    const [status, setStatus] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('success');
    const [loading, setLoading] = useState(true);
    const { id } = useParams();  // getting id from URL params
    const [fetchBids, setFetchBids] = useState(null);
    
    
   
    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
          setImage(event.target.files[0]);
        }
      }
      
  
    const fetchAuctionData = async () => {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:8000/api/result_page/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setImage(response.data.image); 
        console.log(response); // Add this line to inspect the response object
      
        if (response.status === 200) {
          const data = response.data.rows[0]; // Here 'data' is defined correctly
      
          const parsedStartDate = parse(data.start_date, 'dd-MM-yyyy', new Date());
          const formattedStartDate = format(parsedStartDate, 'yyyy-MM-dd');
      
          const parsedEndDate = parse(data.end_date, 'dd-MM-yyyy', new Date());
          const formattedEndDate = format(parsedEndDate, 'yyyy-MM-dd');
         


          setAuctionName(data.auction_name);
          setProductName(data.product_name);
          setStartDate(formattedStartDate);
          setEndDate(formattedEndDate);
          setStartPrice(data.start_price);
          setProductDescription(data.product_description);
          setProductCategory(data.product_category);
          setProductCertification(data.product_certification);
          setStatus(data.status);
          setImage(image);
          setLoading(false);
        } else {
          setLoading(false);
        }
      };
      
      
      
    useEffect(() => {
      fetchAuctionData();
    }, [id, fetchBids]); 
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const formData = new FormData();
      formData.append('auction_name', auctionName);
      formData.append('product_name', productName);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      formData.append('start_price', startPrice);
      formData.append('product_description', productDescription);
      formData.append('product_category', productCategory);
      formData.append('product_certification', productCertification);
      formData.append('status', status);
      formData.append('image', image); 
  
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          return;
        }
  
        const response = await axios.post(`http://localhost:8000/api/update_auction/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data', 
          },
        });
  
        if (response.status === 200) {
          setMessage(response.data.message);
          setMessageType('success');
          setTimeout(() => {
            setMessage('');
            setMessageType('');
            window.location.href = "/UserHome";
          }, 3000);
        } else {
          setMessage(response.data.message);
          setMessageType('error');
          setTimeout(() => {
            setMessage('');
            setMessageType('');
          }, 3000);
        }
      } catch (error) {
        let errorMessage;
        if (error.response && typeof error.response.data.message === 'object') {
          errorMessage = Object.values(error.response.data.message).join(' ');
        } else if (error.response) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = error.message;
        }
        setMessage(errorMessage);
        setMessageType('error');
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      }
    }
  
    return (
      <div style={{ marginTop: '20px', padding: '30px' }}>
          {loading ? (
        <div>Loading...</div>
      ) : (
        <React.Fragment>
          <h1 className='text-center'>Update Auction details here</h1>
       
            <Grid container spacing={4}>
              <Grid item xs={12} sm={8}>
              <Card>
          {message && (
            <Alert severity={messageType}>
              {message}
            </Alert>
          )}
          <CardContent>
              <form onSubmit={handleSubmit} id="createAuction">
  <Grid container spacing={3}>
    <Grid item xs={12} sm={6}>
      <TextField fullWidth label="Auction Name" name="auctionName" variant="outlined" onChange={(e) => setAuctionName(e.target.value)} value={auctionName} required />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField fullWidth label="Product Name" name="productName" variant="outlined" onChange={(e) => setProductName(e.target.value)} value={productName} required />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField fullWidth label="Start Date" name="startDate" type="date" InputLabelProps={{ shrink: true }} variant="outlined" onChange={(e) => setStartDate(e.target.value)} value={startDate} required />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField fullWidth label="End Date" name="endDate" type="date" InputLabelProps={{ shrink: true }} variant="outlined" onChange={(e) => setEndDate(e.target.value)} value={endDate} required />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField fullWidth label="Start Price" name="startPrice" type="number" variant="outlined" onChange={(e) => setStartPrice(e.target.value)} value={startPrice} required />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField fullWidth label="Product Description" name="productDescription" variant="outlined" onChange={(e) => setProductDescription(e.target.value)} value={productDescription} required />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField fullWidth label="Product Category" name="productCategory" variant="outlined" onChange={(e) => setProductCategory(e.target.value)} value={productCategory}  required />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField fullWidth label="Product Certification" name="productCertification" variant="outlined" onChange={(e) => setProductCertification(e.target.value)} value={productCertification} required />
    </Grid>
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth variant="outlined" required>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          id="status"
          label="Status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Deactive">Deactive</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={6}>
    <input 
  accept="image/*" 
  id="raised-button-file" 
  type="file" 
  style={{ display: 'none' }} 
  onChange={handleImageChange} 
/>
<label htmlFor="raised-button-file">
  <Button variant="raised" component="span" style={{ marginTop: '15px' }}>
    Upload Product Image
  </Button>
</label>
{image && <img src={URL.createObjectURL(image)} height="100" width="100" />}

      </Grid>
    <Grid item xs={12} container justifyContent="flex-end">
      <Button style={{ marginTop: '20px' }} variant="contained" sx={{ mr: 5, width: 200 }} color="primary" type="submit">
        Create Auction
      </Button>
    </Grid>
  </Grid>
</form>
</CardContent>
        </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
              <Card>
  <CardContent>
  <Typography variant="h5" component="div" align="center">Auction Preview</Typography>
    <Typography variant="body2" align="center">
      {image ? <img src={URL.createObjectURL(image)} alt="preview" height="200" width="200"/> : "No image selected"}
    </Typography>
   
    <Typography variant="body2">
      <strong>Auction Name:</strong> {auctionName}
    </Typography>
    <Typography variant="body2">
      <strong>Product Name:</strong> {productName}
    </Typography>
    <Typography variant="body2">
      <strong>Start Date:</strong> {startDate}
    </Typography>
    <Typography variant="body2">
      <strong>End Date:</strong> {endDate}
    </Typography>
    <Typography variant="body2">
      <strong>Start Price:</strong> {startPrice}
    </Typography>
    <Typography variant="body2">
      <strong>Product Description:</strong> {productDescription}
    </Typography>
    <Typography variant="body2">
      <strong>Product Category:</strong> {productCategory}
    </Typography>
    <Typography variant="body2">
      <strong>Product Certification:</strong> {productCertification}
    </Typography>
    <Typography variant="body2">
      <strong>Status:</strong> {status}
    </Typography>
  </CardContent>
</Card>

              </Grid>
            </Grid>
            </React.Fragment>
      )}
      </div>
    );
}

export default UpdateAuction;
