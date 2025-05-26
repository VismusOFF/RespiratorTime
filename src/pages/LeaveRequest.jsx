import React, { useState } from 'react';
import { useUser  } from '../context/UserContext';
import { database } from '../assets/firebase';
import { ref, push, set } from 'firebase/database';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';

const LeaveRequest = () => {
  const { user } = useUser ();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <Alert severity="error" variant="outlined" sx={{ width: '100%', textAlign: 'center', fontSize: '1.2rem' }}>
          Пользователь не авторизован
        </Alert>
      </Container>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!startDate || !endDate) {
      setErrorMsg('Пожалуйста, выберите даты начала и конца отпуска');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMsg('Дата окончания отпуска не может быть раньше даты начала');
      return;
    }

    setLoading(true);

    try {
      const leaveRequestsRef = ref(database, `leaveRequests/${user.uid}`);
      const newRequestRef = push(leaveRequestsRef);

      const leaveRequestData = {
        userId: user.uid,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.position || '',
        role: user.role || '',
        photo: user.photo || '',
        startDate,
        endDate,
        comment,
        status: 'новая',
        createdAt: Date.now(),
      };

      await set(newRequestRef, leaveRequestData);

      setSuccessMsg('Заявка на отпуск успешно отправлена!');
      setStartDate('');
      setEndDate('');
      setComment('');
    } catch (error) {
      console.error('Ошибка при отправке заявки: ', error);
      setErrorMsg('Ошибка при отправке заявки. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Отправить заявку на отпуск
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <TextField
                label="Дата начала отпуска"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Дата окончания отпуска"
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Комментарий (необязательно)"
                multiline
                rows={3}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Grid>

            {errorMsg && (
              <Grid item xs={12}>
                <Alert severity="error">{errorMsg}</Alert>
              </Grid>
            )}

            {successMsg && (
              <Grid item xs={12}>
                <Alert severity="success">{successMsg}</Alert>
              </Grid>
            )}

            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Отправить заявку'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default LeaveRequest;
