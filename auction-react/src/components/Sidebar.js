import React from 'react';
import { styled, Box, Drawer, List, ListItem, ListItemText, CssBaseline } from '@mui/material';

const drawerWidth = 240;

const AppDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  marginTop: '25px',
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
}));

const Sidebar = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppDrawer variant="permanent">
        <List>
          {['Item 1', 'Item 2', 'Item 3'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </AppDrawer>
    </Box>
  );
}

export default Sidebar;
