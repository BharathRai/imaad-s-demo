import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import AttendanceIcon from '@mui/icons-material/Assignment'; // Import an appropriate icon for attendance

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#f4f6f8' }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          p: 6,
          borderRadius: '8px',
          mb: 4,
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Academic Management
        </Typography>
        <Typography variant="h6">Manage Academic Records</Typography>
      </Box>

      {/* Options Grid */}
      <Grid container spacing={4} justifyContent="center">
        {/* Student Options */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderRadius: '8px' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/add-student')}
            >
              Add Student
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderRadius: '8px' }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/students')}
            >
              View Students
            </Button>
          </Paper>
        </Grid>

        {/* Faculty Options */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderRadius: '8px' }}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/add-faculty')}
            >
              Add Faculty
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderRadius: '8px' }}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/faculty')}
            >
              View Faculty
            </Button>
          </Paper>
        </Grid>

        {/* Student Records */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderRadius: '8px' }}>
            <Button
              variant="contained"
              color="info"
              fullWidth
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/student-records')}
            >
              Student Records
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderRadius: '8px' }}>
            <Button
              variant="contained"
              color="info"
              fullWidth
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/recordtable')}
            >
              Record Details
            </Button>
          </Paper>
        </Grid>

        {/* Course Management */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderRadius: '8px' }}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/courses')}
            >
              Manage Courses
            </Button>
          </Paper>
        </Grid>

        {/* Department Management */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderRadius: '8px' }}>
            <Button
              variant="contained"
              color="warning"
              fullWidth
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/departments')}
            >
              Manage Departments
            </Button>
          </Paper>
        </Grid>

        {/* Placement Management */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderRadius: '8px' }}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<SchoolIcon />} // Using WorkIcon for placements
              onClick={() => navigate('/placements')}
            >
              Manage Placements
            </Button>
          </Paper>
        </Grid>

        {/* Attendance Management */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderRadius: '8px' }}>
            <Button
              variant="contained"
              color="info"
              fullWidth
              startIcon={<AttendanceIcon />}
              onClick={() => navigate('/attendance')}
            >
              Manage Attendance
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
