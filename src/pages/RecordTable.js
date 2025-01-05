import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

export default function RecordTable() {
  const [records, setRecords] = useState([]);  // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/record')
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setRecords(data.data);
          setLoading(false);
        } else {
          throw new Error('Invalid data format received from server.');
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = (recordId) => {
    fetch(`http://localhost:5000/api/record/${recordId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete record.');
        }
        // Remove the deleted record from the state
        setRecords((prevRecords) => prevRecords.filter((record) => record.RecordID !== parseInt(recordId)));
        setError(null); // Reset error state
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Record Table
      </Typography>

      {/* Loading and Error States */}
      {loading && <Typography>Loading records...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {/* Display records in table format */}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Record ID</TableCell>
                <TableCell>USN</TableCell>
                <TableCell>Projects</TableCell>
                <TableCell>Internship</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length > 0 ? (
                records.map((record) => (
                  <TableRow key={record.RecordID}>
                    <TableCell>{record.RecordID}</TableCell>
                    <TableCell>{record.USN}</TableCell>
                    <TableCell>{record.Projects}</TableCell>
                    <TableCell>{record.Internship}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(record.RecordID)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No records available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
