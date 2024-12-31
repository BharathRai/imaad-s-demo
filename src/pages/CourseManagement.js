import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ CourseName: '', Credits: '', DeptID: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseID, setEditingCourseID] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch courses from the server
  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          throw new Error('Invalid data format received from server.');
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission to add or update a course
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.CourseName || !formData.Credits || !formData.DeptID) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const response = await fetch(
        isEditing
          ? `http://localhost:5000/api/courses/${editingCourseID}`
          : 'http://localhost:5000/api/courses',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage('');
        setFormData({ CourseName: '', Credits: '', DeptID: '' });
        setIsEditing(false);
        setEditingCourseID(null);

        // Refresh courses list
        fetch('http://localhost:5000/api/courses')
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setCourses(data.data);
            }
          });
      } else {
        setErrorMessage(data.error || 'Error occurred.');
      }
    } catch (error) {
      setErrorMessage('Failed to connect to the server.');
    }
  };

  // Handle edit button click
  const handleEdit = (course) => {
    setIsEditing(true);
    setEditingCourseID(course.CourseID);
    setFormData({
      CourseName: course.CourseName,
      Credits: course.Credits,
      DeptID: course.DeptID,
    });
  };

  // Handle delete button click
  const handleDelete = async (courseID) => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseID}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage('');

        // Refresh courses list
        fetch('http://localhost:5000/api/courses')
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setCourses(data.data);
            }
          });
      } else {
        setErrorMessage(data.error || 'Error occurred.');
      }
    } catch (error) {
      setErrorMessage('Failed to connect to the server.');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Course Management
      </Typography>

      {/* Error and Success Messages */}
      {errorMessage && <Typography color="error" gutterBottom>{errorMessage}</Typography>}
      {successMessage && <Typography color="success.main" gutterBottom>{successMessage}</Typography>}

      {/* Course Form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          <TextField
            label="Course Name"
            name="CourseName"
            value={formData.CourseName}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Credits"
            name="Credits"
            value={formData.Credits}
            onChange={handleInputChange}
            type="number"
            required
          />
          <TextField
            label="Department ID"
            name="DeptID"
            value={formData.DeptID}
            onChange={handleInputChange}
            type="number"
            required
          />
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Update Course' : 'Add Course'}
          </Button>
        </Box>
      </form>

      {/* Courses Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Department ID</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.CourseID}>
                  <TableCell>{course.CourseID}</TableCell>
                  <TableCell>{course.CourseName}</TableCell>
                  <TableCell>{course.Credits}</TableCell>
                  <TableCell>{course.DeptID}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(course)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(course.CourseID)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No courses available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
