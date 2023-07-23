import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '../../components/DataTable';

const WonAuctions = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdraw = async (item) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
      console.log(item.id);
      const response = await axios.get(`http://localhost:8000/api/withdrawbids/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data);
      // Show success toast notification
      toast.success('Withdrawal successful');
      // Call fetchData again after success
      fetchData();
    } catch (error) {
      console.error('Error  withdrawal:', error);
      // Show error toast notification
      toast.error('failed  to withdrawal');
    }
  };

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const response = await axios.get('http://localhost:8000/api/won_auctions', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data);
      setColumns(response.data.columns);
      setRows(response.data.rows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const actionButton = (row) => {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          variant="contained"
          size="small"
          component={Link}
          to={`/viewauction/${row.id}/${row.product_name}`}
        >
          View
        </Button>
        {row.delivery_status === 'Pending' && (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => handleWithdraw(row)}
          >
            Withdraw All Bids
          </Button>
        )}
      </div>
    );
  };

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
          <h1 className="text-center">My Won Auctions</h1>
          <DataTable columns={columns} rows={rows} actionButton={actionButton} searchableFields={['auction_name', 'product_name']} />
        </CardContent>
      </Card>
      <ToastContainer /> {/* Add ToastContainer to display toast notifications */}
    </Container>
  );
};

export default WonAuctions;
