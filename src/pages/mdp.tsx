import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const UpdatePassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:9000/clients/?email=${email}`, {
        password,
      });
      // Handle success
      toast.success('Password updated successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  return (
    <main>
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={6} style={{ padding: '2rem' }}>
            <Typography variant="h4" style={{ marginBottom: '2rem' }}>
              Update Password
            </Typography>
            <form onSubmit={handleUpdatePassword}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="New Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    error={error !== ''}
                    helperText={error}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" color="primary" type="submit">
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};

export default UpdatePassword;
