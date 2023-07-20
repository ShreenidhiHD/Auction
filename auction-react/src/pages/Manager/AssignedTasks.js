import DataTable from '../../components/DataTable';
import React, { useState, useEffect ,useRef} from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from '@mui/material';

const AssignedTasks = () => {
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedManager, setSelectedManager] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const handleOpen = (row) => {
      setSelectedRow(row);
      setOpen(true);
    };
  
    const handleClose = () => {
      setSelectedManager('');
      setSelectedRow(null);
      setOpen(false);
    };
  
    const handleDeliveryStatus = async () => {
      if (!selectedRow) return;
      if (!selectedManager) return;
  
      const { id } = selectedRow;
  
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          // Handle unauthenticated state
          return;
        }
  
        const response = await axios.get(`http://localhost:8000/api/manager/verify/${id}/${selectedManager}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        fetchData();
        toast.success('Status changed successfully');
        handleClose();
      } catch (error) {
        toast.error('Failed to change status');
        console.error('Failed to change status:', error);
      }
    };
  
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          // Handle unauthenticated state
          return;
        }
  
        const response = await axios.get('http://localhost:8000/api/manager/assigned_auctions', {
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
        if(row.delivery_status=='Delivered'){
            return 'Delivered'
        }
        else{
            return (
                <Button variant="contained" size="small" color="primary" onClick={() => handleOpen(row)}>
                  Update Status
                </Button>
                 );
        }
     
     
    };
  
    return (
      <Container sx={{ marginTop: '2rem' }}>
        <Card>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Assign Manager</DialogTitle>
            <DialogContent>
              <Select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)}>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeliveryStatus}>Submit</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
  
          <CardContent>
            <h1 className="text-center">Managers</h1>
            <DataTable columns={columns} rows={rows} actionButton={actionButton} />
          </CardContent>
        </Card>
        <ToastContainer position="top-center" />
      </Container>
    );
  };
  
  export default AssignedTasks;
  
