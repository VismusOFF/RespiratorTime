import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, database } from '../assets/firebase'; // Импортируйте и базу данных
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database'; // Импортируйте необходимые функции из Firebase

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser  ] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser  ) => {
      if (firebaseUser  ) {
        // Получаем данные пользователя из базы данных
        const userRef = ref(database, 'users/' + firebaseUser .uid);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUser ({ ...firebaseUser , ...userData }); // Сохраняем объект Firebase User и данные из базы
          }
        });
      } else {
        setUser (null);
      }
      setLoading(false);
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
