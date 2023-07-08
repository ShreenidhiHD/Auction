import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const DashboardPage = () => {
  const notificationCounts = 3; // Default notification count

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Badge
                badgeContent={notificationCounts}
                color="secondary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <NotificationsIcon />
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Listings
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view your listings.
              </Typography>
              <Button
                component={Link}
                to="/userdonations"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#FF5722', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Badge
                badgeContent={notificationCounts}
                color="secondary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <NotificationsIcon />
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Purchases
              </Typography>
              <Typography sx={{ mb: 2 }}>
                View the items you have purchased.
              </Typography>
              <Button
                component={Link}
                to="/mypurchases"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#4CAF50', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Badge
                badgeContent={notificationCounts}
                color="secondary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <NotificationsIcon />
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Bid History
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view your Bid History.
              </Typography>
              <Button
                component={Link}
                to="/myrequests"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#2196F3', color: '#FFF' }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Badge
                badgeContent={notificationCounts}
                color="secondary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <NotificationsIcon />
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Requests
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view food requests from others.
              </Typography>
              <Button
                component={Link}
                to="/requests"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#9C27B0', color: '#FFF' }}
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
