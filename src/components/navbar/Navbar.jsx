import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
  const { user } = useUser();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Респиратор
        </Typography>
        <Button color="inherit" component={Link} to="/work-schedule">
          График Работы
        </Button>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/profile">
              Профиль
            </Button>
            {user.role === 'Администратор' && (
              <Button color="inherit" component={Link} to="/admin">
                Админ-панель
              </Button>
            )}
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/signIn">
              Войти
            </Button>
            <Button color="inherit" component={Link} to="/signUp">
              Зарегистрироваться
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
