import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>

        {}
        <Box>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
          >
            home
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/saved"
          >
            saved
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;