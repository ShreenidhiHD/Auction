import DataTable from '../../components/DataTable';
import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const AuctionBids = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const { id ,auctionname } = useParams(); 
  
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
  
      const response = await axios.get(`http://localhost:8000/api/show_bids/${id}`, {
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
        <Button variant="contained" size="small" component={Link} to={`/donations/${row.id}`}>
          View
        </Button>
        {/* <Button variant="contained" size="small" color="primary" component={Link} to={`/activate/${row.id}`}>
         Bids
        </Button> */}
      </div>
      
    }
  }
  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
            <h1 className='text-center'>My Auction listings</h1>
            <DataTable columns={columns} rows={rows}  />
        </CardContent>
      </Card>
    </Container>
  );
};

export default AuctionBids;
