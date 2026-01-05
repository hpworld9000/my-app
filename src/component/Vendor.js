import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { Avatar, Button, Card, CardContent, CardHeader, CircularProgress, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Vendor = () => {

  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    vendorName: '',
    vendorPhoneNumber: '',
    vendorAddress: '',
    vendorImage: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCloseModal = () => {
    setForm({ vendorName: '', vendorPhoneNumber: '', vendorAddress: '' });
    setErrors({});
    setOpen(false);
    setEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, vendorImage: file }));
    }
  };

  const validate = () => {
    const err = {};
    if (!form.vendorName.trim()) err.vendorName = 'Name is required';
    if (!form.vendorPhoneNumber.trim()) err.vendorPhoneNumber = 'Phone is required';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    setSubmitting(true);
    try {

      if (editMode) {
        await axios.put(`${BASE_URL}/cloudvendor`, {
          vendorId: (form.vendorId).toString(),
          vendorName: form.vendorName,
          vendorPhoneNumber: form.vendorPhoneNumber,
          vendorAddress: form.vendorAddress
        });
      } else {
        await axios.post(`${BASE_URL}/cloudvendor`, {
          vendorName: form.vendorName,
          vendorPhoneNumber: form.vendorPhoneNumber,
          vendorAddress: form.vendorAddress,
          vendorImage: form.vendorImage
        });
      }
      // refresh list
      const res = await axios.get(`${BASE_URL}/cloudvendor`);
      setData(res.data.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding vendor:', error);
      // rudimentary error feedback
      setErrors({ submit: 'Failed to add vendor. Try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    axios.get(`${BASE_URL}/cloudvendor`)
      .then(res => setData(res.data.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  return (
    <div>
      <h2>Vendor Component</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          textTransform: 'none',
          borderRadius: 2,
          boxShadow: '0 6px 18px rgba(25, 118, 210, 0.18)',
          px: 2.5,
          py: 1,
          fontWeight: 600,
        }}
      >
        Add Vendor
      </Button>

      {data ? (
        <Grid container spacing={2}>
          {data.map((vendor) => {
            const initials = vendor.vendorName
              ? vendor.vendorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
              : '';
            return (
              <Grid item key={vendor.vendorId} xs={12} sm={6} md={4}>
                <Card>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{initials}</Avatar>}
                    title={<Typography variant="subtitle1" component="div">{vendor.vendorName}</Typography>}
                    subheader={<Typography variant="body2" color="text.secondary">{vendor.vendorPhoneNumber}</Typography>}
                    action={
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button
                          size="small"
                          onClick={() => {
                            setForm({
                              vendorName: vendor.vendorName || '',
                              vendorPhoneNumber: vendor.vendorPhoneNumber || '',
                              vendorAddress: vendor.vendorAddress || '',
                              vendorId: vendor.vendorId
                            });
                            setErrors({});
                            setEditMode(true);
                            setOpen(true);
                          }}
                          sx={{
                            minWidth: 36,
                            height: 36,
                            p: 0,
                            borderRadius: '50%',
                            textTransform: 'none'
                          }}
                          aria-label="edit vendor"
                        >
                          <span role="img" aria-hidden="false" aria-label="edit">✏️</span>
                        </Button>

                        <Button
                          size="small"
                          onClick={async () => {
                            if (!window.confirm('Are you sure you want to delete this vendor?')) return;
                            try {
                              await axios.delete(`${BASE_URL}/cloudvendor/${vendor.vendorId}`);
                              setData(prev => prev ? prev.filter(v => v.vendorId !== vendor.vendorId) : []);
                            } catch (error) {
                              console.error('Error deleting vendor:', error);
                              setErrors(prev => ({ ...prev, submit: 'Failed to delete vendor. Try again.' }));
                            }
                          }}
                          sx={{
                            minWidth: 36,
                            height: 36,
                            p: 0,
                            borderRadius: '50%',
                            textTransform: 'none'
                          }}
                          aria-label="delete vendor"
                        >
                          <span role="img" aria-hidden="false" aria-label="delete">🗑️</span>
                        </Button>
                      </div>
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {vendor.vendorAddress}
                    </Typography>
                    <Typography
                      component={Link}
                      to={`/vendor/${vendor.vendorId}`}
                      variant="body2"
                      color="primary"
                      sx={{ textDecoration: 'none', fontWeight: 500 }}
                    >
                      View Details
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CircularProgress size={20} />
          <Typography>Loading vendor data...</Typography>
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1400
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              width: 420,
              background: '#fff',
              borderRadius: 8,
              padding: 20,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Typography variant="h6">{editMode ? 'Edit Vendor' : 'Add Vendor'}</Typography>
              <Button onClick={handleCloseModal} size="small">Close</Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Name</label>
              <input
                name="vendorName"
                value={form.vendorName}
                onChange={handleChange}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
              {errors.vendorName && <Typography color="error" variant="body2">{errors.vendorName}</Typography>}

              <label style={{ fontSize: 13, fontWeight: 600 }}>Phone</label>
              <input
                name="vendorPhoneNumber"
                value={form.vendorPhoneNumber}
                onChange={handleChange}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
              {errors.vendorPhoneNumber && <Typography color="error" variant="body2">{errors.vendorPhoneNumber}</Typography>}

              <label style={{ fontSize: 13, fontWeight: 600 }}>Address</label>
              <textarea
                name="vendorAddress"
                value={form.vendorAddress}
                onChange={handleChange}
                rows={3}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', resize: 'vertical' }}
              />

              <label style={{ fontSize: 13, fontWeight: 600 }}>Vendor Image URL</label>
              <input
                name="vendorImage"
                type='file'
                onChange={handleImageUpload}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            {errors.submit && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{errors.submit}</Typography>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <Button onClick={handleCloseModal} disabled={submitting}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? <CircularProgress size={18} color="inherit" /> : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Vendor;
