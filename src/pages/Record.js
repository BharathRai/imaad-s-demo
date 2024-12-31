import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';

export default function Record() {
  const [usn, setUsn] = useState('');
  const [marks, setMarks] = useState('');
  const [attendance, setAttendance] = useState('');
  const [projects, setProjects] = useState('');
  const [internship, setInternship] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    const payload = { Marks: marks, Attendance: attendance, Projects: projects, Internship: internship, USN: usn };

    try {
      const response = await fetch('http://localhost:5000/api/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send the payload to the backend
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage('');
      } else {
        setErrorMessage(data.error || 'Error adding record');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Failed to connect to the server.');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Student Records
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Student USN"
            fullWidth
            value={usn}
            onChange={(e) => setUsn(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Marks"
            fullWidth
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            type="number"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Attendance"
            fullWidth
            value={attendance}
            onChange={(e) => setAttendance(e.target.value)}
            type="number"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Projects"
            fullWidth
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Internship"
            fullWidth
            value={internship}
            onChange={(e) => setInternship(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add Record
          </Button>
        </Grid>
      </Grid>

      {successMessage && <Typography color="success.main">{successMessage}</Typography>}
      {errorMessage && <Typography color="error.main">{errorMessage}</Typography>}
    </Box>
  );
}
