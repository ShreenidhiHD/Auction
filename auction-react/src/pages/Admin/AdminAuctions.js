import DataTable from '../../components/DataTable';
import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from '@mui/material';
const AdminAuctions = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchData();
    fetchManagers();
  }, []);
  
  const handleOpen = async (row) => {
    // Save the row being assigned in the state
    setSelectedRow(row);
    setOpen(true);
  };
const handleClose = () => {
  setSelectedManager("");
  setSelectedRow(null);
  setOpen(false);
};
  const handleAssign = async () => {
    if (!selectedRow) return;  // No row has been selected

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Handle unauthenticated state
      return;
    }
    console.log(selectedRow.id);
    console.log(selectedManager);
    try {
        const response = await axios.get(`http://localhost:8000/api/admin/assign_manager/${selectedRow.id}/${selectedManager}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        fetchData().then(() => {
          toast.success(` Successfully assigned`);
        })
        // handle response here

        setOpen(false);
    } catch (error) {
      toast.error(`Failed to assign`);
        console.error('Failed to assign manager:', error);
    }
};
const searchableFields = ["created_by", "auction_name", "product_name"];

  const handleDeactivateClick = async (item) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
      
      const response = await axios.patch(`http://localhost:8000/api/admin/auctions_update/${item.id}/deactive`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

   

      if (response.data.message === "Auction updated successfully.") {
        fetchData().then(() => {
          toast.success(`Deactivation done Successfully`);
        })
      } else {
        toast.error(response.data.message || 'Failed to Deactivate');
      }
    } catch (error) {
      if (error.response) {
        toast.error('Failed to deactivate: ' + error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        toast.error('Failed to deactivate: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        toast.error('Failed to deactivate: ' + error.message);
      }
    }
  };

  const handleActivateClick = async (item) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const response = await axios.patch(`http://localhost:8000/api/admin/auctions_update/${item.id}/Active`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data); // Check the response data

      if (response.data.message === "Auction updated successfully.") {
        fetchData().then(() => {
          toast.success(`Activation done Successfully`);
        })
      } else {
        toast.error(response.data.message || 'Failed to Activate');
      }
    } catch (error) {
      if (error.response) {
        toast.error('Failed to activate: ' + error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        toast.error('Failed to activate: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        toast.error('Failed to activate: ' + error.message);
      }
    }
  };
 
  const fetchManagers = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Handle unauthenticated state
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/managerslist`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data); // Add this line
      setManagers(response.data.managers);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };
  
  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
  
      const response = await axios.get('http://localhost:8000/api/admin/auctions', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
     
      setColumns(response.data.columns);
      setRows(response.data.rows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const actionButton = (row) => {
    if (row.status === 'Active' || row.status === 'Verified') {
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="contained" size="small" component={Link} onClick={() => handleDeactivateClick(row)}>
            Deactivate
          </Button>
          <Button variant="contained" size="small" color="primary" component={Link} to={`/auction/bids/${row.id}/${row.auction_name}`}>
            Bids
          </Button>
          {row.delivery_status === 'Assigned' ? (
            <div>Assigned</div>
          ) : (
            row.winner !== 'N/A' && (
              <Button variant="contained" size="small" color="primary" onClick={() => handleOpen(row)}>
                Assign
              </Button>
            )
          )}
        </div>
      );
    } else if (row.status !== 'Hidden') {
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="contained" size="small" component={Link} onClick={() => handleActivateClick(row)}>
            Activate
          </Button>
          <Button variant="contained" size="small" color="primary" component={Link} to={`/auction/bids/${row.id}/${row.auction_name}`}>
            Bids
          </Button>
          {row.delivery_status === 'Assigned' ? (
            <div>Assigned</div>
          ) : (
            row.winner !== 'N/A' && (
              <Button variant="contained" size="small" color="primary" onClick={() => handleOpen(row)} searchableFields={[ "created_by",
              "auction_name",
              "product_name"]}>
                Assign
              </Button>
            )
          )}
        </div>
      );
    }
  };
  

  

  return (
    
      <Card>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Assign Manager</DialogTitle>
        <DialogContent>
        <Select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)}>
        {managers?.length ? managers.map((manager) => (
  <MenuItem key={manager.id} value={manager.id}>{manager.name}</MenuItem>
)) : <MenuItem>Loading...</MenuItem>}

</Select>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssign}>Submit</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      
        <CardContent>
            <h1 className='text-center'>Auctions</h1>
            <DataTable columns={columns} rows={rows} actionButton={actionButton} searchableFields={searchableFields} />
        </CardContent>
        <ToastContainer position="top-center" />
      </Card>
     
    
  );
};

export default AdminAuctions;
