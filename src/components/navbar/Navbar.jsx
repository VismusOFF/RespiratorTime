import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
  const { user } = useUser();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Левая часть: название */}
        <Box sx={{ flexShrink: 0 }}>
          <Typography variant="h6" noWrap>
            Респиратор
          </Typography>
        </Box>

        {/* Центр: навигационные кнопки */}
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, justifyContent: 'center' }}>
          <Button color="inherit" component={Link} to="/work-schedule">
            График Работы
          </Button>
          <Button color="inherit" component={Link} to="/leave-request">
            Взять Отпуск
          </Button>
          <Button color="inherit" component={Link} to="/leave-request-view">
            Мои отпуска
          </Button>
          {user?.role === 'Администратор' && (
            <Button color="inherit" component={Link} to="/admin">
              Админ-панель
            </Button>
            
          )}
          {user?.role === 'Администратор' && (
            <Button color="inherit" component={Link} to="/admin-leave-request">
              Заявки на отпуск
            </Button>
            
          )}
        </Box>

        {/* Правая часть: авторизация/профиль */}
        <Box sx={{ flexShrink: 0, display: 'flex', gap: 1 }}>
          {user ? (
            <Button color="inherit" component={Link} to="/profile">
              Профиль
            </Button>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
