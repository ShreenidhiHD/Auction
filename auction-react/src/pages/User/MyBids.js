import DataTable from '../../components/DataTable';
import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const MyBids = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const { id ,auctionname } = useParams(); 
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelClick = async (item) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/delete_bid/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response.data); // Check the response data

      if (response.data.message === "Bid deleted successfully") {
        fetchData().then(() => {
          toast.success(`Bid Canceled successfully`);
        })
       
      } else {
        toast.error(response.data.message || ' Unable to delete winning bid! To cancle bid contact admin');
      }
    } catch (error) {
      console.error(error);
      toast.error(' Unable to delete winning bid! To cancle bid contact admin');
    }
  };

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        // Handle unauthenticated state
        return;
      }
  
      const response = await axios.get(`http://localhost:8000/api/my_participations`, {
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
      return    <Button variant="contained" size="small"  onClick={() => handleCancelClick(row)}>
          Cancel bid
        </Button>
    
     
    }
  }
  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
            <h1 className='text-center'>My Participation</h1>
            <DataTable columns={columns} rows={rows}  actionButton={actionButton} actionButtonText="Action" searchableFields={['created_by', 'auction_name']}/>
        </CardContent>
      </Card>
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default MyBids;
