import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { Avatar, Card, CardContent, CardHeader,  Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const VendorDetails = () => {
  const { id } = useParams();
  const [vendorDetails, setVendorDetails] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/cloudvendor/${id}`)
      .then(res => setVendorDetails(res.data.data))
      .catch(error => console.error('Error fetching vendor details:', error));
  }, []);

  const initials = vendorDetails?.vendorName
              ? vendorDetails.vendorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
              : '';

  return (
    <div>
      <h1>Vendor Details Page</h1>
      <Card>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{initials}</Avatar>}
          title={<Typography variant="subtitle1" component="div">{vendorDetails?.vendorName}</Typography>}
          subheader={<Typography variant="body2" color="text.secondary">{vendorDetails?.vendorPhoneNumber}</Typography>}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {vendorDetails?.vendorAddress}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDetails;