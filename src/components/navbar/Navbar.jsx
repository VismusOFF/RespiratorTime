import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useUser  } from '../../context/UserContext'; // Импортируем хук для доступа к контексту

const Navbar = () => {
  const { user } = useUser (); // Получаем информацию о пользователе из контекста

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Респиратор
        </Typography>
        {user ? ( // Проверяем, есть ли пользователь
          <Button color="inherit" component={Link} to="/profile">
            Профиль
          </Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/signIn">
              Войти
            </Button>
            <Button color="inherit" component={Link} to="/signUp">
              Авторизоваться
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
