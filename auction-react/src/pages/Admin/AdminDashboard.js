import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PeopleIcon from '@mui/icons-material/People'; 
import GavelIcon from '@mui/icons-material/Gavel'; 
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; 
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const AdminDashboard = () => {

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card>
              <CardContent>
                <PeopleIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 1 }}>
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
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card>
              <CardContent>
                <GavelIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 1 }}>
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
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card>
              <CardContent>
                <SupervisorAccountIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                  Managers
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  View Managers.
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
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card>
              <CardContent>
                <PersonAddIcon color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                  Manager
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Create Manager.
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
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
