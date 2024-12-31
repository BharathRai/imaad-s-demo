import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ DeptID: '', DeptName: '', Staff: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch departments
  useEffect(() => {
    fetch('http://localhost:5000/api/departments')
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setDepartments(data.data);  // Set fetched departments
        } else {
          setErrorMessage('Failed to fetch departments.');
        }
      })
      .catch(() => setErrorMessage('Failed to fetch departments.'));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDepartment = () => {
    const newDept = { DeptID: formData.DeptID, DeptName: formData.DeptName, Staff: formData.Staff };

    // POST request to add a new department
    fetch('http://localhost:5000/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDept),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update departments with the new department from API response
          setDepartments([
            ...departments,
            { DeptID: formData.DeptID, DeptName: formData.DeptName, Staff: formData.Staff },
          ]);
          setSuccessMessage('Department added successfully!');
          setFormData({ DeptID: '', DeptName: '', Staff: '' });
        } else {
          setErrorMessage(data.error || 'Failed to add department.');
        }
      })
      .catch(() => setErrorMessage('Failed to connect to the server.'));
  };

  const handleDeleteDepartment = (deptID) => {
    // DELETE request to remove a department
    fetch(`http://localhost:5000/api/departments/${deptID}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update departments by filtering out the deleted department
          setDepartments(departments.filter((dept) => dept.DeptID !== deptID));
          setSuccessMessage('Department deleted successfully!');
        } else {
          setErrorMessage(data.error || 'Failed to delete department.');
        }
      })
      .catch(() => setErrorMessage('Failed to connect to the server.'));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Departments
      </Typography>

      {/* Form for Adding Department */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Department
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Department ID"
              name="DeptID"
              value={formData.DeptID}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Department Name"
              name="DeptName"
              value={formData.DeptName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Staff Count"
              name="Staff"
              type="number"
              value={formData.Staff}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleAddDepartment}
        >
          Add Department
        </Button>
        {successMessage && <Typography color="success.main">{successMessage}</Typography>}
        {errorMessage && <Typography color="error.main">{errorMessage}</Typography>}
      </Paper>

      {/* Display Department Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Department ID</TableCell>
              <TableCell>Department Name</TableCell>
              <TableCell>Staff Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <TableRow key={dept.DeptID}>
                  <TableCell>{dept.DeptID}</TableCell>
                  <TableCell>{dept.DeptName}</TableCell>
                  <TableCell>{dept.Staff}</TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteDepartment(dept.DeptID)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No departments available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
