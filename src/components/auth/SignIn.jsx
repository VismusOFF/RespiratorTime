import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Container, TextField, Button, Typography, FormControlLabel } from '@mui/material';
import { auth } from '../../assets/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
      navigate('/profile');
    } catch (err) {
      setError('Неправильный логин или пароль');
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
        Авторизация
      </Typography>
      <Box component="form" onSubmit={handleSignIn} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
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
        <TextField
          label="Пароль"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          variant="outlined"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              color="primary"
            />
          }
          label="Запомнить меня"
        />
        {error && (
          <Typography color="error" variant="body2" mb={1}>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Войти
        </Button>
      </Box>
      <Button onClick={() => navigate('/signup')} sx={{ mt: 2 }}>
        Нет аккаунта? Зарегистрироваться
      </Button>
    </Container>
  );
};

export default SignIn;
