import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: '#123456', color: 'white', textAlign: 'center', p: 2 }}>
      <Typography variant="body2">© 2024 Academic Management System</Typography>
    </Box>
  );
}
