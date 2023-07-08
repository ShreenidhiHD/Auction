import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableSortLabel,
  TablePagination,
  TextField,
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

const DataTable = ({ columns, rows }) => {
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rows.filter((row) =>
  (row.id.toString().includes(searchQuery.toLowerCase()) ||
  row.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  row.prepared_date.includes(searchQuery.toLowerCase()))
);



  const sortedRows = filteredRows.sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (valueA < valueB) {
      return sortOrder === 'asc' ? -1 : 1;
    } else if (valueA > valueB) {
      return sortOrder === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  });

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={handleSearch}
        sx={{ marginBottom: '1rem' }}
      />
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                <TableSortLabel
                  active={sortField === column.field}
                  direction={sortField === column.field ? sortOrder : 'asc'}
                  onClick={() => handleSort(column.field)}
                >
                  {column.headerName}
                  {sortField === column.field && (
                    <KeyboardArrowUp
                      fontSize="small"
                      sx={{
                        visibility: sortOrder === 'asc' ? 'visible' : 'hidden',
                      }}
                    />
                  )}
                  {sortField === column.field && (
                    <KeyboardArrowDown
                      fontSize="small"
                      sx={{
                        visibility: sortOrder === 'desc' ? 'visible' : 'hidden',
                      }}
                    />
                  )}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.field}>{row[column.field]}</TableCell>
              ))}
              <TableCell>
                <Button variant="contained" size="small">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
};

export default DataTable;
