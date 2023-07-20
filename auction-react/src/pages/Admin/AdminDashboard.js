import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const AdminDashboard = () => {

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Users
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view Users.
              </Typography>
              <Button
                component={Link}
                to="/adminusers"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#3f51b5', color: '#FFF' }} // Blue color
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Auctions
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Manage and view Auctions.
              </Typography>
              <Button
                component={Link}
                to="/AdminAuctions"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#4caf50', color: '#FFF' }} // Green color
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Managers
              </Typography>
              <Typography sx={{ mb: 2 }}>
                View Managers
              </Typography>
              <Button
                component={Link}
                to="/adminmanagerlist"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#ff9800', color: '#FFF' }} // Orange color
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Manager
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Create Manager
              </Typography>
              <Button
                component={Link}
                to="/admincreatemanager"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#f44336', color: '#FFF' }} // Red color
              >
                Create
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
