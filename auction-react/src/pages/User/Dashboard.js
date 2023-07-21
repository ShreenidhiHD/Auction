import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const DashboardPage = () => {
  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Listings
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view your listings.
              </Typography>
              <Button
                component={Link}
                to="/UserAuctions"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#FF5722', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Participation
              </Typography>
              <Typography sx={{ mb: 2 }}>
                View the auctions you have participated in.
              </Typography>
              <Button
                component={Link}
                to="/MyBids"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#4CAF50', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
