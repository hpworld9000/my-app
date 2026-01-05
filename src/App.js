import React from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { increment, decrement } from './features/counter/CounterSlice';
import Vendor from './component/Vendor';
import {
  AppBar,
  Typography,
  Container,
  Box,
  CssBaseline,
  Button
} from '@mui/material';
import Header from './component/navbar/Header';
import Home from './component/Home';
import Product from './component/Product';
import NotFoundPage from './component/NotFoundPage';
import VendorDetails from './component/VendorDetails';

function App() {
  const count = useSelector((state) => state.counter?.value ?? 0);
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <CssBaseline />

      <AppBar position="static">
        <Header />
      </AppBar>

      {/* Main container */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vendor" element={<Vendor />} />
              <Route path="/vendor/:id" element={<VendorDetails />} />
              <Route path="/product" element={<Product />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Box>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} MyApp. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </React.Fragment>
  );
}

export default App;
