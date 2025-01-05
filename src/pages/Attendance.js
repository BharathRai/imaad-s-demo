import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Attendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [formData, setFormData] = useState({ CourseName: '', USN: '', DeptID: '', Attendance: '', Marks: '', Result: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState({ CourseName: null, USN: null });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/attendance')
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setAttendanceData(data.data);
                }
            })
            .catch(() => {
                setErrorMessage('Failed to fetch attendance data.');
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.CourseName || !formData.USN || !formData.DeptID || formData.Attendance === '' || !formData.Marks || !formData.Result) {
            setErrorMessage('All fields are required.');
            return;
        }

        try {
            const response = await fetch(
                isEditing
                    ? `http://localhost:5000/api/attendance/${editingRecord.CourseName}/${editingRecord.USN}`
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
                setFormData({ CourseName: '', USN: '', DeptID: '', Attendance: '', Marks: '', Result: '' });
                setIsEditing(false);
                setEditingRecord({ CourseName: null, USN: null });

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

    const handleEdit = (record) => {
        setFormData(record);
        setIsEditing(true);
        setEditingRecord({ CourseName: record.CourseName, USN: record.USN });
    };

    const handleDelete = async (record) => {
        try {
            const response = await fetch(`http://localhost:5000/api/attendance/${record.CourseName}/${record.USN}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message);
                setErrorMessage('');

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

            {errorMessage && <Typography color="error" gutterBottom>{errorMessage}</Typography>}
            {successMessage && <Typography color="success.main" gutterBottom>{successMessage}</Typography>}

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
                        label="USN"
                        name="USN"
                        value={formData.USN}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        label="Dept ID"
                        name="DeptID"
                        value={formData.DeptID}
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
                    <TextField
                        label="Result"
                        name="Result"
                        value={formData.Result}
                        onChange={handleInputChange}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        {isEditing ? 'Update Record' : 'Add Record'}
                    </Button>
                </Box>
            </form>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course Name</TableCell>
                            <TableCell>USN</TableCell>
                            <TableCell>Dept ID</TableCell>
                            <TableCell>Attendance</TableCell>
                            <TableCell>Marks</TableCell>
                            <TableCell>Result</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceData.length > 0 ? (
                            attendanceData.map((record) => (
                                <TableRow key={`${record.CourseName}-${record.USN}`}>
                                    <TableCell>{record.CourseName}</TableCell>
                                    <TableCell>{record.USN}</TableCell>
                                    <TableCell>{record.DeptID}</TableCell>
                                    <TableCell>{record.Attendance}</TableCell>
                                    <TableCell>{record.Marks}</TableCell>
                                    <TableCell>{record.Result}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(record)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(record)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
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
