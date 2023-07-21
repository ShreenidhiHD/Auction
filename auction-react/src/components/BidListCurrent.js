import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const BidListCurrent = ({ bidsData }) => {
    return (
        <TableContainer component={Paper} style={{ maxHeight: 560, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Bid Amount</TableCell>
              <TableCell align="right">Date Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bidsData.slice().reverse().map((bid) => (    //reverse the array before mapping
              <TableRow key={bid.id}>
                <TableCell component="th" scope="row">
                  {bid.created_by}
                </TableCell>
                <TableCell align="right">{bid.price}</TableCell>
                <TableCell align="right">{bid.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>      
    );
};

export default BidListCurrent;
