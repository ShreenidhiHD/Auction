import React from 'react';
import { styled } from '@mui/system';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';

import Container from '@mui/material/Container';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// import your components
import Users from './Users';
import Auctions from './Auctions';
import ReportedAccounts from './ReportedAccounts';
import AdminCreateManager from 'Components/../AdminCreateManager';
import ManagerList from './ManagerList';
import Profile from './Profile';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
});

const StyledMain = styled('main')({
  flexGrow: 1,
  padding: theme => theme.spacing(3),
});

const AdminDashboard = () => {
  return (
    <Router>
      <StyledDrawer variant="permanent">
        <Toolbar />
        <div>
          <List>
            {['Users', 'Auctions', 'Reported Accounts', 'Create Manager', 'Manager List', 'Profile'].map((text, index) => (
              <ListItem button key={text} component={Link} to={`/${text.toLowerCase().replace(' ', '-')}`}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
      </StyledDrawer>
      <StyledMain>
        <Toolbar />
        <Container sx={{ marginTop: '2rem' }}>
          <Routes>
            <Route path="users" element={<Users />} />
            <Route path="auctions" element={<Auctions />} />
            <Route path="reported-accounts" element={<ReportedAccounts />} />
            <Route path="create-manager" element={<AdminCreateManager />} />
            <Route path="manager-list" element={<ManagerList />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </Container>
      </StyledMain>
    </Router>
  );
};

export default AdminDashboard;
