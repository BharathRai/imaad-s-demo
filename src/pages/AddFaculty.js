import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AddFaculty() {
  const [facultyData, setFacultyData] = useState({
    FacultyID: '',
    FacultyName: '',
    Phone: '',
    DeptID: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacultyData({ ...facultyData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!/^\d{10}$/.test(facultyData.Phone)) {
      setSnackbar({ open: true, message: 'Phone number must be exactly 10 digits.', severity: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyData),
      });

      const data = await response.json();
      if (response.ok) {
        setSnackbar({ open: true, message: 'Faculty added successfully!', severity: 'success' });
        setFacultyData({
          FacultyID: '',
          FacultyName: '',
          Phone: '',
          DeptID: '',
        });
        setTimeout(() => navigate('/faculty'), 2000); // Navigate after a delay for the user to see the success message
      } else {
        const errorMessage = data.error || data.message || 'An error occurred!';
        setSnackbar({ open: true, message: `Error: ${errorMessage}`, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    }
  };

  // Close the snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add Faculty
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Faculty ID"
            variant="outlined"
            name="FacultyID"
            value={facultyData.FacultyID}
            onChange={handleChange}
            required
          />
          <TextField
            label="Faculty Name"
            variant="outlined"
            name="FacultyName"
            value={facultyData.FacultyName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone"
            variant="outlined"
            name="Phone"
            value={facultyData.Phone}
            onChange={handleChange}
            required
            type="tel"
          />
          <TextField
            label="Department ID"
            variant="outlined"
            name="DeptID"
            value={facultyData.DeptID}
            onChange={handleChange}
            required
          />
          <Button variant="contained" color="primary" type="submit">
            Add Faculty
          </Button>
        </Box>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
