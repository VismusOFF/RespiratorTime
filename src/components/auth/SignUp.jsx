import React, { useState } from 'react';
import { Box, Container, TextField, Button, Typography } from '@mui/material';
import { auth, database } from '../../assets/firebase'; // Убедитесь, что вы импортируете database
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database'; // Импортируем функции для работы с Realtime Database
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Состояние для подтверждения пароля
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Сохранение данных в Realtime Database
      await set(ref(database, 'users/' + user.uid), {
        email: email,
        role: 'сотрудник', // Базовая роль
      });

      navigate('/profile'); // Перенаправление после успешной регистрации
    } catch (err) {
      setError('Ошибка регистрации: ' + err.message);
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
        Регистрация
      </Typography>
      <Box component="form" onSubmit={handleSignUp} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
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
        <TextField
          label="Подтвердите пароль"
          type="password"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="current-password"
          variant="outlined"
        />
        {error && (
          <Typography color="error" variant="body2" mb={1}>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Зарегистрироваться
        </Button>
      </Box>
      
      <Button sx={{ mt: 2 }} onClick={() => navigate('/signIn')} color="primary">Есть аккаунт? Авторизоваться</Button>
      
    </Container>
  );
};

export default SignUp;
