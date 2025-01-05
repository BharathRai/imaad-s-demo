import React, { useState } from 'react';
import { Box, Typography, Button, Grid2 as Grid, Paper, Tooltip, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import AttendanceIcon from '@mui/icons-material/Assignment';
import MenuIcon from '@mui/icons-material/Menu';

export default function Home() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const categories = [
    { text: 'Student Options', items: [
      { text: 'Add Student', icon: <SchoolIcon />, path: '/add-student' },
      { text: 'View Students', icon: <SchoolIcon />, path: '/students' }
    ]},
    { text: 'Faculty Options', items: [
      { text: 'Add Faculty', icon: <SchoolIcon />, path: '/add-faculty' },
      { text: 'View Faculty', icon: <SchoolIcon />, path: '/faculty' }
    ]},
    { text: 'Records', items: [
      { text: 'Student Records', icon: <SchoolIcon />, path: '/student-records' },
      { text: 'Record Details', icon: <SchoolIcon />, path: '/recordtable' }
    ]},
    { text: 'Management', items: [
      { text: 'Manage Courses', icon: <SchoolIcon />, path: '/courses' },
      { text: 'Manage Departments', icon: <SchoolIcon />, path: '/departments' },
      { text: 'Manage Placements', icon: <SchoolIcon />, path: '/placements' },
      { text: 'Manage Attendance', icon: <AttendanceIcon />, path: '/attendance' }
    ]}
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Button onClick={toggleDrawer(true)} sx={{ position: 'absolute', top: 16, left: 16 }}>
        <MenuIcon />
      </Button>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            {categories.map((category, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <Typography variant="h6">{category.text}</Typography>
                </ListItem>
                {category.items.map((item, idx) => (
                  <ListItem button key={idx} onClick={() => navigate(item.path)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 4, textAlign: 'center', backgroundColor: '#f4f6f8' }}>
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
            <Tooltip title="Add a new student" arrow>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
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
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="View all students" arrow>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
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
            </Tooltip>
          </Grid>

          {/* Faculty Options */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Add a new faculty member" arrow>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
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
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="View all faculty members" arrow>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
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
            </Tooltip>
          </Grid>

          {/* Student Records */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="View student records" arrow>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
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
            </Tooltip>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="View record details" arrow>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
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
            </Tooltip>
          </Grid>

          {/* Course Management */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Manage courses" arrow>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
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
            </Tooltip>
          </Grid>

          {/* Department Management */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Manage departments" arrow>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
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
            </Tooltip>
          </Grid>

          {/* Placement Management */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Manage placements" arrow>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={<SchoolIcon />}
                  onClick={() => navigate('/placements')}
                >
                  Manage Placements
                </Button>
              </Paper>
            </Tooltip>
          </Grid>

          {/* Attendance Management */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Manage attendance" arrow>
              <Paper
                elevation={3}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
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
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
