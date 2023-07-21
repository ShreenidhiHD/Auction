import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


const BidButton = styled(Button)`
  color: white;
  background-color: #f50057;
  &:hover {
    background-color: #c51162;
  }
`;

const BiddingCard = ({ item }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(item.status);
  const [openDialog, setOpenDialog] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
 
  const handleBidClick = async () => {
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

  const handleConfirmBid = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const bidData = {
        auction_id: item.id,
        price: bidAmount,
      };

      try {
        const response = await axios.post(
          'http://localhost:8000/api/create_bid', // change this URL to match your bidding API
          bidData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setMessage(response.data.message);
        setMessageType('success');
        handleDialogClose();

      } catch (error) {
        console.error(error);
        setMessage('Bid submission failed');
        setMessageType('error');
      }

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      setMessage('Bid submission failed');
      setMessageType('error');

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };
  const imageURL = `http://localhost:8000/images/${item.image_url.substring(item.image_url.lastIndexOf('/') + 1)}`;
  
  return (
    <Card>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>{"Enter your bid amount"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your bid amount below:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="bidAmount"
            label="Bid Amount"
            type="number"
            fullWidth
            variant="standard"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirmBid}>
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {item.created_by.charAt(0).toUpperCase()}
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
        title={`Created by: ${item.created_by}`}
        subheader={item.start_date}
      />


  <CardMedia
    component="img"
    height="400" // Increase image height to give more emphasis
    image={imageURL}
    alt={item.product_name}
  />

  <CardContent>
    <Typography variant="h5" color="text.primary" gutterBottom>
      {item.product_name}
    </Typography>

    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
      Category: {item.product_category}
    </Typography>

    <Typography variant="body2" color="text.secondary">
      Start Date: {item.start_date} <br />
      End Date: {item.end_date} <br />
    </Typography>

    <Typography variant="h6" color="text.primary">
      Starting Price: INR{item.start_price} 
    </Typography>
  </CardContent>

  <CardActions disableSpacing>
    {/* <Button variant="contained" color="primary" onClick={handleBidClick}>
      Place Bid
    </Button> */}
     <Button variant="contained" color="primary" component={Link} to={`/viewauction/${item.id}/${item.product_name}`}>
      View
    </Button>
  </CardActions>

  {message && (
    <Box mt={2}>
      <Alert severity={messageType}>
        {message}
      </Alert>
    </Box>
  )}
</Card>

  );
};

export default BiddingCard;
