import React, { useState } from 'react';
import { Box, Container, TextField, Button, Typography} from '@mui/material';
import { useUser  } from '../../context/UserContext';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const { resetPassword } = useUser ();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const result = await resetPassword(email);
      if (result) {
        setSuccess('Ссылка на сброс пароля отправлена на вашу электронную почту.');
      } else {
        setError('Ошибка при отправке ссылки на сброс пароля.');
      }
    } catch (err) {
      setError('Ошибка при отправке ссылки на сброс пароля.');
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 8,
        p: 4,
        bgcolor: '#F2F3F5',
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" mb={3} fontWeight="bold">
        Сброс пароля
      </Typography>
      <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <TextField
          label="Почта"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          variant="outlined"
        />
        {error && (
          <Typography color="error" variant="body2" mb={1}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success" variant="body2" mb={1}>
            {success}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Сбросить пароль
        </Button>
        <Button component={Link} to="/signIn" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Вернуться ко входу
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPassword;
