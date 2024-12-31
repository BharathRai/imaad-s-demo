import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students from the server
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/students')
      .then((response) => response.json())
      .then((data) => setStudents(data.data))  // Ensure the correct property is accessed
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  // Handle the "Edit" button click
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
  };

  // Handle the "Delete" button click
  const handleDelete = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(`http://localhost:5000/api/students/${selectedStudent.USN}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Student deleted successfully!');
        setStudents(students.filter((student) => student.USN !== selectedStudent.USN));
        setIsEditing(false);
        setSelectedStudent(null);
      } else {
        const data = await response.json();
        alert('Error deleting student: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student List
      </Typography>

      {/* Handle Loading and Error States */}
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>USN</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>DeptID</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.USN}>
                    <TableCell>{student.USN}</TableCell>
                    <TableCell>{student.StudentName}</TableCell>
                    <TableCell>{student.Email}</TableCell>
                    <TableCell>{student.Phone}</TableCell>
                    <TableCell>{student.DeptID}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No student data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Deletion Confirmation */}
      {isEditing && selectedStudent && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="h6">Are you sure you want to delete this student?</Typography>
          <Typography variant="body1">
            {selectedStudent.StudentName} ({selectedStudent.USN})
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDelete}
            sx={{ mt: 2, mr: 2 }}
          >
            Yes, Delete
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setIsEditing(false);
              setSelectedStudent(null);
            }}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
}
