import { Container, Grid, TextField, Button, Card, CardContent, CardMedia } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AuctionCardData from '../../components/AuctionCardData';
import BidListCurrent from '../../components/BidListCurrent';
import { useNavigate } from "react-router-dom";
import BidderForm from '../../components/BidderForm ';
import Dialog from '@mui/material/Dialog';
import { toast, ToastContainer } from 'react-toastify';

const ViewAuction = () =>{
    const navigate = useNavigate();
    const { id ,product_name } = useParams(); 
    const [data, setData] = useState([]);
    const [bidsData, setBidsData] = useState([]);
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
    useEffect(() => {
        const fetchData = async () => {
          try {
            const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            // Handle unauthenticated state
            return;
          }
            const response = await axios.get(`http://localhost:8000/api/result_page/${id}`, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
            setData(response.data.rows);

         const responseBids = await axios.get(`http://localhost:8000/api/show_bids/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setBidsData(responseBids.data.rows);
          } catch (error) {
            console.error(error);
          }
        };
        
        fetchData();
        const interval = setInterval(fetchData, 10000); // Fetch data every 10 seconds

        return () => clearInterval(interval); // Clear the interval when the component unmounts
      }, []);
      const fetchBids = async () => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          // Handle unauthenticated state
          return;
        }
      
        const responseBids = await axios.get(`http://localhost:8000/api/show_bids/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setBidsData(responseBids.data.rows);
      };
      
      useEffect(() => {
        fetchBids();
      }, []);
    return(
        <Container style={{ marginTop: '20px', }}>
            <Card>
                <CardMedia>
            <h1>Details of Auction</h1>
            <Grid container spacing={2}>
            {data.map((auction, index) => (
                <React.Fragment key={index}>
                    <Grid item xs={12} md={4}>
                        <AuctionCardData auctionData={auction} />
                    </Grid>
                    <Grid item xs={12} md={2} >
                        <BidderForm auctionData={auction}  onNewBid={fetchBids}/>
                    </Grid>
                </React.Fragment>
            ))}
               <Grid item xs={12} md={6}>
                <BidListCurrent bidsData={bidsData}/>
               </Grid>
           </Grid>
           </CardMedia>
           </Card>
       
        </Container>
    )
}
export default ViewAuction;