import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Navbar from './components/navbar';
import Footer from './components/footer';

// Page Components
import Home from './pages/Home';
import AddStudent from './pages/AddStudent';
import StudentTable from './pages/StudentTable';
import AddFaculty from './pages/AddFaculty';
import FacultyList from './pages/FacultyList';
import Record from './pages/Record';
import RecordTable from './pages/RecordTable';
import CourseManagement from './pages/CourseManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import PlacementManagement from './pages/PlacementManagement';
import LoginPage from './login/LoginPage'; // Import Login Page
import Attendance from './pages/Attendance';
// Create a custom theme for the application
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    success: { main: '#4caf50' },
    info: { main: '#00bcd4' },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  // Handle user login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Handle user logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <Box sx={{ p: 2 }}>
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            
            {/* Protected Routes */}
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/students" element={<StudentTable />} />
                <Route path="/add-faculty" element={<AddFaculty />} />
                <Route path="/faculty" element={<FacultyList />} />
                <Route path="/student-records" element={<Record />} />
                <Route path="/recordtable" element={<RecordTable />} />
                <Route path="/courses" element={<CourseManagement />} />
                <Route path="/departments" element={<DepartmentManagement />} />
                <Route path="/placements" element={<PlacementManagement />} />
                <Route path="/attendance" element={<Attendance/>} />
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              // Redirect unauthenticated users to the login page
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </Box>
        {isAuthenticated && <Footer />}
      </Router>
    </ThemeProvider>
  );
}

export default App;
