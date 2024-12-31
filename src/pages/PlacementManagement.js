import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';

export default function PlacementManagement() {
  const [placements, setPlacements] = useState([]); // Initialize as an empty array
  const [formData, setFormData] = useState({
    USN: '',
    ParticipationStatus: '',
    PkgOffered: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch placements data
  useEffect(() => {
    fetch('http://localhost:5000/api/placement')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPlacements(data.data);  // Ensure data is set correctly
        } else {
          setErrorMessage('Failed to fetch placements.');
        }
      })
      .catch(() => setErrorMessage('Failed to fetch placements.'));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddPlacement = () => {
    fetch('http://localhost:5000/api/placement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPlacements([...placements, { PlacementID: data.PlacementID, ...formData }]);
          setSuccessMessage('Placement added successfully!');
          setFormData({ USN: '', ParticipationStatus: '', PkgOffered: '' });
        } else {
          setErrorMessage(data.error || 'Failed to add placement.');
        }
      })
      .catch(() => setErrorMessage('Failed to connect to the server.'));
  };

  const handleDeletePlacement = (placementID) => {
    fetch(`http://localhost:5000/api/placement/${placementID}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPlacements(placements.filter((placement) => placement.PlacementID !== placementID));
          setSuccessMessage('Placement deleted successfully!');
        } else {
          setErrorMessage(data.error || 'Failed to delete placement.');
        }
      })
      .catch(() => setErrorMessage('Failed to connect to the server.'));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Placements
      </Typography>

      {/* Add Placement Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Placement
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="USN"
              name="USN"
              value={formData.USN}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Participation Status"
              name="ParticipationStatus"
              value={formData.ParticipationStatus}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Package Offered"
              name="PkgOffered"
              type="number"
              value={formData.PkgOffered}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleAddPlacement}
        >
          Add Placement
        </Button>
        {successMessage && <Typography color="success.main">{successMessage}</Typography>}
        {errorMessage && <Typography color="error.main">{errorMessage}</Typography>}
      </Paper>

      {/* Placement Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Placement ID</TableCell>
              <TableCell>USN</TableCell>
              <TableCell>Participation Status</TableCell>
              <TableCell>Package Offered</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {placements.length > 0 ? (
              placements.map((placement) => (
                <TableRow key={placement.PlacementID}>
                  <TableCell>{placement.PlacementID}</TableCell>
                  <TableCell>{placement.USN}</TableCell>
                  <TableCell>{placement.ParticipationStatus}</TableCell>
                  <TableCell>{placement.PkgOffered}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeletePlacement(placement.PlacementID)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No placements available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Error Message */}
      {errorMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
}
