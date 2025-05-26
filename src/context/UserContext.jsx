import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, database } from '../assets/firebase'; 
import { onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database'; 
import { CircularProgress, Box } from '@mui/material'; // Импортируем необходимые компоненты MUI

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser ) => {
      if (firebaseUser ) {
        // Получаем данные пользователя из базы данных
        const userRef = ref(database, 'users/' + firebaseUser .uid);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUser ({ ...firebaseUser , ...userData });
          }
          setLoading(false); // Устанавливаем loading в false после загрузки данных
        });
      } else {
        setUser (null);
        setLoading(false); // Устанавливаем loading в false, если пользователь не авторизован
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser (null);
      console.log('Пользователь вышел из системы');
      navigate('/signIn');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Ошибка при сбросе пароля:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser , logout, resetPassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser  = () => useContext(UserContext);
