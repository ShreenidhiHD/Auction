import React, { useState } from 'react';
import { Button, TextField ,Box } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BidderForm = ( props  ) => {
    const [bid, setBid] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const { auctionData, onNewBid } = props; 
    const handleConfirmBid = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            // Handle unauthenticated state
            setMessage('User not authenticated');
            setMessageType('error');
            return;
          }
    
          const bidData = {
            auction_id: auctionData.id,
            price: bid,
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
            toast.success(response.data.message);
            setMessage(response.data.message);
            setMessageType('success');
            onNewBid(); 
          } catch (error) {
            if (error.response && error.response.data && error.response.data.error === "Please bid higher than the previous bid") {
              toast.error("Please bid higher than the previous bid"); // Show specific error message as toast
            } else {
              toast.error("Bid submission failed"); // Show generic error message as toast
            }
            console.error(error);
            setMessage('Bid submission failed');
            setMessageType('error');
          }
    
          setTimeout(() => {
            setMessage('');
            setMessageType('');
          }, 3000);
        } catch (error) {
          toast.error('Bid submission failed');
          setMessage('Bid submission failed');
          setMessageType('error');
    
          setTimeout(() => {
            setMessage('');
            setMessageType('');
          }, 3000);
        }
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleConfirmBid();
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <Box marginBottom={2}>
                <TextField 
                    type="number"
                    label="Bid Amount"
                    value={bid}
                    onChange={e => setBid(e.target.value)}
                    required
                    fullWidth
                />
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Place Bid
            </Button>
            <ToastContainer position="top-center" />
        </form>
    );
 };

export default BidderForm;
