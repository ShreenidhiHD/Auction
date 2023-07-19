import React from 'react';
import { Card, CardContent, Typography, CardMedia, Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
  maxWidth: 345,
});

const StyledMedia = styled(CardMedia)({
  height: 250,
});

const AuctionCardData = ({ auctionData }) => {
    const imageURL = `http://localhost:8000/images/${auctionData.image.substring(auctionData.image.lastIndexOf('/') + 1)}`;
    return (
        <StyledCard>
            
            <StyledMedia
                component="img"
                height="700" // Increase image height to give more emphasis
                image={imageURL}
                alt={auctionData.product_name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {auctionData.product_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Created by: {auctionData.created_by}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Auction Name: {auctionData.auction_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Start Date: {auctionData.start_date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    End Date: {auctionData.end_date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Start Price: {auctionData.start_price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Product Description: {auctionData.product_description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Product Category: {auctionData.product_category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Product Certification: {auctionData.product_certification}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Delivery Status: {auctionData.delivery_status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Status: {auctionData.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Winner: {auctionData.winner}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Result: {auctionData.result}
                </Typography>
            </CardContent>
        </StyledCard>
    );
};

export default AuctionCardData;
