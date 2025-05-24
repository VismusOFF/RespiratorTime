import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../assets/firebase'; // путь к вашей инициализации Firebase
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true); // Чтобы знать, когда идет загрузка
  const navigate = useNavigate(); // Переместите useNavigate сюда

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser ) => {
      if (firebaseUser ) {
        setUser (firebaseUser ); // сохраняем объект Firebase User
      } else {
        setUser (null);
      }
      setLoading(false);
    });

    // Очистка подписки при размонтировании
    return () => unsubscribe();
  }, []);

  // Функция для выхода
  const logout = async () => {
    try {
      await signOut(auth);
      setUser (null); // Обновляем состояние пользователя
      console.log('Пользователь вышел из системы');
      navigate('/signIn'); // Перенаправление на страницу входа
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  // Пока идет загрузка, можно вернуть null или загрузочный компонент
  if (loading) {
    return <div>Загрузка пользователя...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser , logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser  = () => useContext(UserContext);
