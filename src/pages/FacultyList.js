import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

export default function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/faculty')
      .then((response) => response.json())
      .then((data) => setFaculty(data.data))  // Ensure the correct property is accessed
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/faculty/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete');
        }
        setFaculty(faculty.filter((fac) => fac.FacultyID !== id));
      })
      .catch((error) => setError(error.message));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Faculty List
      </Typography>

      {/* Handle Loading and Error States */}
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Faculty ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>DeptID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faculty.length > 0 ? (
                faculty.map((fac) => (
                  <TableRow key={fac.FacultyID}>
                    <TableCell>{fac.FacultyID}</TableCell>
                    <TableCell>{fac.FacultyName}</TableCell>
                    <TableCell>{fac.Email}</TableCell>
                    <TableCell>{fac.Phone}</TableCell>
                    <TableCell>{fac.DeptID}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => handleDelete(fac.FacultyID)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No faculty data available
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
