import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Attendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [formData, setFormData] = useState({ CourseID: '', StudentID: '', Attendance: '', Marks: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecordID, setEditingRecordID] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch courses from the server
    // Fetch attendance data from the server
    useEffect(() => {
        fetch('http://localhost:5000/api/attendance')
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setAttendanceData(data.data);
                }
            })
            .catch((error) => {
                setErrorMessage('Failed to fetch attendance data.');
            });
    }, []);
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission to add or update attendance record
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.CourseID || !formData.StudentID || !formData.Attendance || !formData.Marks) {
            setErrorMessage('All fields are required.');
            return;
        }

        try {
            const response = await fetch(
                isEditing
                    ? `http://localhost:5000/api/attendance/${editingRecordID}`
                    : 'http://localhost:5000/api/attendance',
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
                setFormData({ CourseID: '', StudentID: '', Attendance: '', Marks: '' });
                setIsEditing(false);
                setEditingRecordID(null);

                // Refresh attendance data
                fetch('http://localhost:5000/api/attendance')
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            setAttendanceData(data.data);
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
    const handleEdit = (record) => {
        setIsEditing(true);
        setEditingRecordID(record.RecordID);
        setFormData({
            CourseID: record.CourseID,
            StudentID: record.StudentID,
            Attendance: record.Attendance,
            Marks: record.Marks,
        });
    };

    // Handle delete button click
    const handleDelete = async (recordID) => {
        try {
            const response = await fetch(`http://localhost:5000/api/attendance/${recordID}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message);
                setErrorMessage('');

                // Refresh attendance data
                fetch('http://localhost:5000/api/attendance')
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            setAttendanceData(data.data);
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
                Attendance and Marks Management
            </Typography>

            {/* Error and Success Messages */}
            {errorMessage && <Typography color="error" gutterBottom>{errorMessage}</Typography>}
            {successMessage && <Typography color="success.main" gutterBottom>{successMessage}</Typography>}

            {/* Attendance Form */}
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                    <TextField
                        label="Course ID"
                        name="CourseID"
                        value={formData.CourseID}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        label="Student ID"
                        name="StudentID"
                        value={formData.StudentID}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        label="Attendance"
                        name="Attendance"
                        value={formData.Attendance}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        label="Marks"
                        name="Marks"
                        value={formData.Marks}
                        onChange={handleInputChange}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        {isEditing ? 'Update Record' : 'Add Record'}
                    </Button>
                </Box>
            </form>

            {/* Attendance Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Record ID</TableCell>
                            <TableCell>Course ID</TableCell>
                            <TableCell>Student ID</TableCell>
                            <TableCell>Attendance</TableCell>
                            <TableCell>Marks</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceData.length > 0 ? (
                            attendanceData.map((record) => (
                                <TableRow key={record.RecordID}>
                                    <TableCell>{record.RecordID}</TableCell>
                                    <TableCell>{record.CourseID}</TableCell>
                                    <TableCell>{record.StudentID}</TableCell>
                                    <TableCell>{record.Attendance}</TableCell>
                                    <TableCell>{record.Marks}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(record)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(record.RecordID)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No records available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}