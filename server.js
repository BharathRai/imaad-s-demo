const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // To parse JSON request bodies

// ********** MySQL CONNECTION **********
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'bharathrai1sv', // Replace with your MySQL password
  database: 'academic_manage', // Ensure this database exists
});

// Test MySQL Connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL database.');
});

// ********** API ROUTES **********

// Reusable function to validate DeptID
const validateDeptID = (DeptID, res, callback) => {
  const query = 'SELECT * FROM department WHERE DeptID = ?';
  db.query(query, [DeptID], (err, results) => {
    if (err) {
      console.error('Error validating DeptID:', err.message);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid DeptID' });
    }
    callback();
  });
};

// ********** STUDENT API **********

// Get all students
app.get('/api/students', (req, res) => {
  const query = 'SELECT * FROM Student';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to fetch students' });
    }
    res.status(200).json({ success: true, data: results });
  });
});

// Add a new student
app.post('/api/students', (req, res) => {
  const { USN, StudentName, Email, Phone, DeptID } = req.body;
  if (!USN || !StudentName || !Email || !Phone || !DeptID) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  validateDeptID(DeptID, res, () => {
    const query = 'INSERT INTO Student (USN, StudentName, Email, Phone, DeptID) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [USN, StudentName, Email, Phone, DeptID], (err) => {
      if (err) {
        console.error('Error adding student:', err.message);
        return res.status(500).json({ success: false, error: 'Failed to add student' });
      }
      res.status(201).json({ success: true, message: 'Student added successfully' });
    });
  });
});

// Delete a student by USN
app.delete('/api/students/:USN', (req, res) => {
  const { USN } = req.params;
  const query = 'DELETE FROM Student WHERE USN = ?';
  db.query(query, [USN], (err, result) => {
    if (err) {
      console.error('Error deleting student:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to delete student' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  });
});

// ********** FACULTY API **********

// Get all faculty records
app.get('/api/faculty', (req, res) => {
  const query = 'SELECT * FROM Faculty';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching faculty:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to fetch faculty records' });
    }
    res.status(200).json({ success: true, data: results });
  });
});

// Add a new faculty
app.post('/api/faculty', (req, res) => {
  const { FacultyID, FacultyName, Phone, DeptID } = req.body;
  if (!FacultyID || !FacultyName || !Phone || !DeptID) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  validateDeptID(DeptID, res, () => {
    const query = 'INSERT INTO Faculty (FacultyID, FacultyName, Phone, DeptID) VALUES (?, ?, ?, ?)';
    db.query(query, [FacultyID, FacultyName, Phone, DeptID], (err) => {
      if (err) {
        console.error('Error adding faculty:', err.message);
        return res.status(500).json({ success: false, error: 'Failed to add faculty' });
      }
      res.status(201).json({ success: true, message: 'Faculty added successfully' });
    });
  });
});
// Delete a faculty by FacultyID
app.delete('/api/faculty/:FacultyID', (req, res) => {
  const { FacultyID } = req.params;
  const query = 'DELETE FROM Faculty WHERE FacultyID = ?';
  db.query(query, [FacultyID], (err, result) => {
    if (err) {
      console.error('Error deleting faculty:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to delete faculty' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }
    res.status(200).json({ success: true, message: 'Faculty deleted successfully' });
  });
});
// ********** STUDENT RECORDS API **********

// Add a new student record
app.post('/api/record', (req, res) => {
  const { Marks, Attendance, Projects, Internship, USN } = req.body;

  // Ensure that Marks, Attendance, and USN are provided
  if (!Marks || !Attendance || !USN) {
    return res.status(400).json({ success: false, error: 'Marks, Attendance, and USN are required' });
  }

  const query = 'INSERT INTO record (Marks, Attendance, Projects, Internship, USN) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [Marks, Attendance, Projects, Internship, USN], (err, result) => {
    if (err) {
      console.error('Error adding student record:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to add student record' });
    }
    res.status(201).json({ success: true, message: 'Student record added successfully', RecordID: result.insertId });
  });
});


// Get all student records
app.get('/api/record', (req, res) => {
  const query = 'SELECT * FROM record';  // No filtering by USN
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching records:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to fetch records' });
    }
    res.status(200).json({ success: true, data: results });  // Send all records
  });
});
// Delete a student record by RecordID
app.delete('/api/record/:RecordID', (req, res) => {
  const { RecordID } = req.params;

  if (!RecordID) {
    return res.status(400).json({ success: false, error: 'RecordID is required' });
  }

  const query = 'DELETE FROM record WHERE RecordID = ?';
  db.query(query, [RecordID], (err, result) => {
    if (err) {
      console.error('Error deleting student record:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to delete student record' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Student record not found' });
    }
    res.status(200).json({ success: true, message: 'Student record deleted successfully' });
  });
});
// ********** COURSE API **********

// Get all courses
app.get('/api/courses', (req, res) => {
  const query = 'SELECT * FROM Course';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to fetch courses' });
    }
    res.status(200).json({ success: true, data: results });
  });
});

// Add a new course
app.post('/api/courses', (req, res) => {
  const { CourseName, Credits, DeptID } = req.body;

  if (!CourseName || !DeptID) {
    return res.status(400).json({ success: false, error: 'CourseName and DeptID are required' });
  }

  const query = 'INSERT INTO Course (CourseName, Credits, DeptID) VALUES (?, ?, ?)';
  db.query(query, [CourseName, Credits, DeptID], (err, result) => {
    if (err) {
      console.error('Error adding course:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to add course' });
    }
    res.status(201).json({ success: true, message: 'Course added successfully', CourseID: result.insertId });
  });
});

// Update a course by CourseID
app.put('/api/courses/:CourseID', (req, res) => {
  const { CourseID } = req.params;
  const { CourseName, Credits, DeptID } = req.body;

  if (!CourseName || !DeptID) {
    return res.status(400).json({ success: false, error: 'CourseName and DeptID are required' });
  }

  const query = `
    UPDATE Course 
    SET CourseName = ?, Credits = ?, DeptID = ?
    WHERE CourseID = ?
  `;
  db.query(query, [CourseName, Credits, DeptID, CourseID], (err, result) => {
    if (err) {
      console.error('Error updating course:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to update course' });
    }
    res.status(200).json({ success: true, message: 'Course updated successfully' });
  });
});

// Delete a course by CourseID
app.delete('/api/courses/:CourseID', (req, res) => {
  const { CourseID } = req.params;

  const query = 'DELETE FROM Course WHERE CourseID = ?';
  db.query(query, [CourseID], (err, result) => {
    if (err) {
      console.error('Error deleting course:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to delete course' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  });
});

// ********** DEPARTMENT API **********
// Get all departments
app.get('/api/departments', (req, res) => {
  const query = 'SELECT * FROM department';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching departments:', err.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch departments. Please try again later.',
      });
    }
    res.status(200).json({ success: true, data: results });
  });
});

// Add a new department
app.post('/api/departments', (req, res) => {
  const { DeptID, DeptName, Staff } = req.body;

  // Validate that DeptID and DeptName are provided
  if (!DeptID || !DeptName || DeptName.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Department ID and name are required and cannot be empty.',
    });
  }

  // If Staff is not provided, set it to null (nullable field)
  const staffCount = Staff ? Staff : null;

  // Insert the new department into the database
  const query = 'INSERT INTO department (DeptID, DeptName, Staff) VALUES (?, ?, ?)';
  db.query(query, [DeptID, DeptName, staffCount], (err, result) => {
    if (err) {
      console.error('Error adding department:', err.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to add department. Please try again later.',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Department added successfully',
      DeptID: DeptID,  // Return the provided DeptID
    });
  });
});

// Delete a department by DeptID
app.delete('/api/departments/:DeptID', (req, res) => {
  const { DeptID } = req.params;

  const query = 'DELETE FROM department WHERE DeptID = ?';
  db.query(query, [DeptID], (err, result) => {
    if (err) {
      console.error('Error deleting department:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to delete department' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }
    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  });
});
// ********** PLACEMENT API **********

// Get all placements
app.get('/api/placement', (req, res) => {
  const query = 'SELECT * FROM placement';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching placements:', err.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch placements. Please try again later.',
      });
    }
    res.status(200).json({ success: true, data: results });
  });
});
// Add a new placement
app.post('/api/placement', (req, res) => {
  const { ParticipationStatus, PkgOffered, USN } = req.body;

  // If USN is not provided, return an error as it's necessary for the placement
  if (!USN || USN.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'USN is required and cannot be empty.',
    });
  }

  // Handle the ParticipationStatus and PkgOffered fields, allowing them to be nullable
  const participationStatus = ParticipationStatus !== undefined ? ParticipationStatus : null;
  const pkgOffered = PkgOffered !== undefined ? PkgOffered : null;

  // Insert the new placement record into the database
  const query = 'INSERT INTO placement (ParticipationStatus, PkgOffered, USN) VALUES (?, ?, ?)';
  db.query(query, [participationStatus, pkgOffered, USN], (err, result) => {
    if (err) {
      console.error('Error adding placement:', err.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to add placement. Please try again later.',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Placement added successfully',
      PlacementID: result.insertId,  // Return the auto-generated PlacementID
    });
  });
});

// Delete a placement
app.delete('/api/placement/:placementID', (req, res) => {
  const { placementID } = req.params;

  const query = 'DELETE FROM placement WHERE PlacementID = ?';
  db.query(query, [placementID], (err, result) => {
    if (err) {
      console.error('Error deleting placement:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to delete placement' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Placement not found' });
    }
    res.status(200).json({ success: true, message: 'Placement deleted successfully' });
  });
});


// Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  const query = 'SELECT * FROM login WHERE email = ? AND role = ?';
  db.query(query, [email, role], (err, results) => {
    if (err) {
      console.error('Error validating user:', err.message);
      return res.status(500).json({ success: false, error: 'Internal server error.' });
    }

    if (results.length > 0) {
      const user = results[0];

      // Direct password comparison (without bcrypt hashing)
      if (password === user.password_hash) {
        res.status(200).json({ success: true, message: 'Login successful.' });
      } else {
        res.status(401).json({ success: false, error: 'Invalid credentials.' });
      }
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }
  });
});

// Create Account Endpoint
app.post('/api/register', (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  const query = 'INSERT INTO login (username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())';
  db.query(query, [username, email, password, role], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, error: 'Email already exists.' });
      }
      console.error('Error creating user:', err.message);
      return res.status(500).json({ success: false, error: 'Internal server error.' });
    }

    // Send success message after account creation
    res.status(201).json({ success: true, message: 'Account created successfully.' });
  });
});

// ********** ATTENDANCE API **********

// Get all attendance records
app.get('/api/attendance', (req, res) => {
  const query = 'SELECT * FROM attendance';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching attendance records:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to fetch attendance records' });
    }
    res.status(201).json({ success: true, data: results });
  });
});

// Add a new attendance record
app.post('/api/attendance', (req, res) => {
  const { CourseID, USN, DeptID, Attendance, Marks, Result } = req.body;

  if (!CourseID || !USN || !DeptID || Attendance === undefined || !Marks || !Result) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  const query = 'INSERT INTO attendance (CourseID, USN, DeptID, Attendance, Marks, Result) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [CourseID, USN, DeptID, Attendance, Marks, Result], (err, result) => {
    if (err) {
      console.error('Error adding attendance record:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to add attendance record' });
    }
    res.status(201).json({ success: true, message: 'Attendance record added successfully' });
  });
});

// Update an attendance record by CourseID and USN
app.put('/api/attendance/:CourseID/:USN', (req, res) => {
  const { CourseID, USN } = req.params;
  const { DeptID, Attendance, Marks, Result } = req.body;

  if (!DeptID || Attendance === undefined || !Marks || !Result) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  const query = 'UPDATE attendance SET DeptID = ?, Attendance = ?, Marks = ?, Result = ? WHERE CourseID = ? AND USN = ?';
  db.query(query, [DeptID, Attendance, Marks, Result, CourseID, USN], (err, result) => {
    if (err) {
      console.error('Error updating attendance record:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to update attendance record' });
    }
    res.status(200).json({ success: true, message: 'Attendance record updated successfully' });
  });
});

// Delete an attendance record by CourseID and USN
app.delete('/api/attendance/:CourseID/:USN', (req, res) => {
  const { CourseID, USN } = req.params;

  const query = 'DELETE FROM attendance WHERE CourseID = ? AND USN = ?';
  db.query(query, [CourseID, USN], (err, result) => {
    if (err) {
      console.error('Error deleting attendance record:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to delete attendance record' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Attendance record not found' });
    }
    res.status(200).json({ success: true, message: 'Attendance record deleted successfully' });
  });
});

// ********** ERROR HANDLING **********

// Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// ********** START SERVER **********

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
