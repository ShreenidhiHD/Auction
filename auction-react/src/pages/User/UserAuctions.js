import DataTable from '../../components/DataTable';
import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const UserAuctions = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
  
      const response = await axios.get('http://localhost:8000/api/my_auctionslist', {
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
    if (row.status ==='inactive'){
      return 'Deactivated By Admin'
    }
    else{
      return   <div style={{ display: 'flex', gap: '8px' }}>
        {row.has_bids === 'No' ? 
          <Button variant="contained" size="small" component={Link} to={`/auctions/update_auction/${row.id}`}>
            Update
          </Button>
          : 
          <Button variant="contained" size="small" component={Link} to={`/viewauction/${row.id}/${row.product_name}`}>
            View
          </Button>
        }
        <Button variant="contained" size="small" color="primary" component={Link} to={`/auction/bids/${row.id}/${row.auction_name}`}>
         Bids
        </Button>
      </div>
    }
  }
  
  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
            <h1 className='text-center'>My Auction listings</h1>
            <DataTable columns={columns} rows={rows} actionButton={actionButton} searchableFields={['created_by', 'auction_name']}/>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserAuctions;
