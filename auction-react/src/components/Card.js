import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { Container, Grid, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useNavigate } from "react-router-dom";


const RequestButton = styled(Button)`
  color: white;
  background-color: #f50057;
  &:hover {
    background-color: #c51162;
  }
`;

const RecipeReviewCard = ({ item }) => {
  const navigate = useNavigate();
  const [requested, setRequested] = useState(item.buttonStatus === 'request');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(item.buttonStatus);
  const [openDialog, setOpenDialog] = useState(false);
  const [description, setDescription] = useState('');

  const [openDetails, setOpenDetails] = useState(false);

  const handleClickOpenDetails = () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Redirect to login page if user is not authenticated
      navigate("/login");
    } else {
      // Continue with your previous logic
      setOpenDetails(true);
    }
    
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };
  const handleRequestClick = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Redirect to login page if user is not authenticated
      navigate("/login");
    } else {
      // Continue with your previous logic
      setOpenDialog(true);
    }
    
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmRequest = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const requestedData = {
        donation_id: item.id,
        description: description, // use user input instead of hardcoded string
      };

      try {
        const response = await axios.post(
          'http://localhost:8000/api/purchase/requests',
          requestedData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setRequested(true);
        setMessage(response.data.message);
        setMessageType('success');
        setButtonStatus('cancel');
        console.log(item.id);
        handleDialogClose();

      } catch (error) {
        console.error(error);
        setMessage('Request failed');
        setMessageType('error');
      }

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      let errorMessage;
      if (typeof error.response.data.message === 'object') {
        errorMessage = Object.values(error.response.data.message).join(' ');
      } else {
        errorMessage = error.response.data.message;
      }

      setMessage(errorMessage);
      setMessageType('error');

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  const handleCancelClick = () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      axios
        .get(`http://localhost:8000/api/purchase/requests/cancel/${item.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(response => {
          setRequested(false);
          setMessage(response.data.message);
          setMessageType('success');
          console.log(item.id);
          setButtonStatus('request');
        })
        .catch(error => {
          console.error(error);
          setMessage('Cancellation failed');
          setMessageType('error');
        });

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage('Cancellation failed');
      setMessageType('error');

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  return (
    <Card>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>{"Enter your description"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your description below:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirmRequest}>
            Request
          </Button>
        </DialogActions>
      </Dialog>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {item.username.charAt(0).toUpperCase()}
          </Avatar>
  }
  action={
    <>
      <IconButton 
        aria-label="settings"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          setAnchorEl(null);
          // Here you can put the same code used in share button click handler
          if (navigator.share) {
            navigator.share({
              title: 'Share Donation',
              text: 'Check out this donation!',
              url: item.shareableLink,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
          } else {
            alert(`Share this link: ${item.shareableLink}`);
          }
        }}>
          Share
        </MenuItem>
        <MenuItem onClick={() => {
          setAnchorEl(null);
          window.location.href = `mailto:?subject=I want to report this donation&body=Check out this donation: ${item.shareableLink}`;
        }}>
          Report
        </MenuItem>
      </Menu>
    </>
  }
  title={`Created by: ${item.username}`}
  subheader={item.prepared_date}
/>


<Box display="flex" justifyContent="flex-end" style={{ marginRight: '50px' }}>
    {item.verified && <Chip label="Verified" color="primary" size="small" />}
</Box>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Food type: {item.food_type} <br />
          Number of plates: {item.number_of_plates} <br />
          Location: {item.location}
        </Typography>
      </CardContent>
      <Dialog open={openDetails}
  onClose={handleCloseDetails}
  PaperProps={{style: {width: "600px"}}} >
        <DialogTitle>{"Donation Details"}</DialogTitle>
  <DialogContent>
  <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <b>Food type:</b> {item.food_type} 
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <b>Number of plates:</b> {item.number_of_plates} 
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <b>Location:</b> {item.location}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <b>Delivery Status:</b> {item.delivery_status}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <b>Price:</b> {item.price}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <b>Expiry in days:</b> {item.expiry_in_days}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              <b>Event Name:</b> {item.event_name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              <b>Description:</b> {item.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              <b>Address:</b> {item.city}, {item.state}, {item.country}, {item.pincode}
            </Typography>
          </Grid>
        </Grid>
  </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDetails}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <CardActions disableSpacing>
      {buttonStatus === 'donater' ? (
        <Typography variant="body1" color="text.primary">
          Thanks for donating
        </Typography>
      ) : (
        <>
          {buttonStatus === 'cancel' ? (
            <RequestButton onClick={handleCancelClick}>Cancel</RequestButton>
          ) : buttonStatus === 'accepted' ? (
            <Typography variant="body1" color="text.primary">
              Your request accepted
            </Typography>
          ) : (
            <RequestButton onClick={handleRequestClick}>Request</RequestButton>
          )}
        </>
      )}

        
  <IconButton
  aria-label="share"
  style={{ marginRight: '10px' }}
  onClick={() => {
    if (navigator.share) {
      navigator.share({
        title: 'Share Donation',
        text: 'Check out this donation!',
        url: item.shareableLink,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      alert(`Share this link: ${item.shareableLink}`);
    }
  }}
>
  <ShareIcon />
</IconButton>
<Button
  variant="contained"
  style={{ 
    marginRight: '10px',
    backgroundColor: 'white',
    color: 'black'
  }}
  onClick={handleClickOpenDetails}
>
  Show Details
</Button>

</CardActions>

      {message && (
        <Alert severity={messageType}>
          {message}
        </Alert>
      )}
    </Card>
  );
};

export default RecipeReviewCard;
