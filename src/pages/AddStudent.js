import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AddStudent() {
  const [studentData, setStudentData] = useState({
    USN: '',
    StudentName: '',
    Email: '',
    Phone: '',
    DeptID: '',
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!studentData.USN || !studentData.StudentName || !studentData.Email || !studentData.Phone || !studentData.DeptID) {
      setSnackbar({ open: true, message: 'Please fill out all fields.', severity: 'warning' });
      return false;
    }

    if (!emailRegex.test(studentData.Email)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address.', severity: 'warning' });
      return false;
    }

    if (!phoneRegex.test(studentData.Phone)) {
      setSnackbar({ open: true, message: 'Phone number must be exactly 10 digits.', severity: 'warning' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true); // Start loading
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();
      setLoading(false); // Stop loading

      if (response.ok) {
        setSnackbar({ open: true, message: 'Student added successfully!', severity: 'success' });
        setStudentData({ USN: '', StudentName: '', Email: '', Phone: '', DeptID: '' });
        setTimeout(() => navigate('/students'), 2000);
      } else {
        setSnackbar({ open: true, message: `Error: ${data.error || data.message || 'An error occurred!'}`, severity: 'error' });
      }
    } catch (error) {
      setLoading(false);
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add Student
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="USN"
            variant="outlined"
            name="USN"
            value={studentData.USN}
            onChange={handleChange}
            required
            aria-label="Enter the USN"
          />
          <TextField
            label="Student Name"
            variant="outlined"
            name="StudentName"
            value={studentData.StudentName}
            onChange={handleChange}
            required
            aria-label="Enter the student name"
          />
          <TextField
            label="Email"
            variant="outlined"
            name="Email"
            value={studentData.Email}
            onChange={handleChange}
            required
            type="email"
            aria-label="Enter the email"
          />
          <TextField
            label="Phone"
            variant="outlined"
            name="Phone"
            value={studentData.Phone}
            onChange={handleChange}
            required
            type="tel"
            aria-label="Enter the phone number"
          />
          <TextField
            label="Department ID"
            variant="outlined"
            name="DeptID"
            value={studentData.DeptID}
            onChange={handleChange}
            required
            aria-label="Enter the department ID"
          />
          <Button variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Add Student'}
          </Button>
        </Box>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'success' ? 3000 : 6000}
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
