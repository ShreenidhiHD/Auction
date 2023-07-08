import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import image1 from '../images/image1.jpg';
import image2 from '../images/image2.jpg';

const AboutUs = () => {
  return (
    <Container maxWidth="xl" sx={{ paddingTop: '40px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        About Us
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia component="img" sx={{ height: '400px', objectFit: 'cover' }} image={image1} alt="Extra Food Waste Management" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body1" gutterBottom>
                Extra Food Waste Management is a comprehensive platform designed to address the pressing issue of food waste while promoting sustainable solutions. Our platform aims to connect food donors, recipients, and charities, enabling the efficient distribution of surplus meals and reducing waste in the process.
              </Typography>
              <Typography variant="body1">
                At Extra Food Waste Management, we recognize the significant amount of food that goes to waste each day, while many people struggle to access nutritious meals. Our platform serves as a bridge between those with excess food and those in need, ensuring that no good food goes to waste and that it reaches the individuals and communities that can benefit from it the most.
              </Typography>
              <Typography variant="body1">
                Through our platform, food donors have the opportunity to make a positive impact by sharing their excess meals. Donors can easily upload information about the available food, including the quantity, type, and expiration date. This information helps potential recipients and charities identify suitable donations and coordinate the collection or delivery of the food.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia component="img" sx={{ height: '400px', objectFit: 'cover' }} image={image2} alt="Extra Food Waste Management" />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body1" gutterBottom>
                Recipients, on the other hand, can browse the available donations and submit requests based on their specific needs. They can view detailed descriptions of the donated food items, such as whether they are vegetarian or non-vegetarian, and make informed decisions. Our platform also facilitates communication between donors and recipients, allowing them to coordinate the pickup or delivery details.
              </Typography>
              <Typography variant="body1">
                Charities play a crucial role in our platform by connecting with both donors and recipients. They can view the donation listings, communicate with donors, and raise requests for specific types of food based on the needs of the communities they serve. Our platform enables charities to efficiently manage their food distribution activities and ensure that donated meals reach those who need them the most.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutUs;
