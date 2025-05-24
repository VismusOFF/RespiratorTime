import React, { useEffect, useState } from 'react';
import { useUser  } from '../../context/UserContext';
import { Container, Typography, Grid, Paper, TextField, Button, CircularProgress } from '@mui/material';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../assets/firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = () => {
  const { user, logout } = useUser (); // Предполагаем, что logout доступен из контекста
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const userRef = ref(database, 'users/' + user.uid);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserData(data);
        setFormData(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const userRef = ref(database, 'users/' + user.uid);

    try {
      // Обновляем данные профиля (без фото)
      await update(userRef, formData);

      // Если выбран файл, загружаем в Storage и обновляем ссылку в базе
      if (file) {
        const storage = getStorage();
        const avatarRef = storageRef(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, file);
        const downloadURL = await getDownloadURL(avatarRef);

        await update(userRef, { photo: downloadURL });
        setUserData(prev => ({ ...prev, photo: downloadURL }));
        setFormData(prev => ({ ...prev, photo: downloadURL }));
        setFile(null);
      } else {
        setUserData(formData);
      }

      setEditing(false);
    } catch (error) {
      console.error("Ошибка обновления данных: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Загрузка данных профиля...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          Ваш профиль
        </Typography>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>ФИО:</strong> {editing ? (
                <TextField
                  fullWidth
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  variant="outlined"
                  label="Имя"
                />
              ) : (
                userData.fullName || 'Без имени'
              )}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Почта:</strong> {editing ? (
                <TextField
                  fullWidth
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  variant="outlined"
                  label="Почта"
                />
              ) : (
                userData.email
              )}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Роль:</strong> {editing ? (
                <TextField
                  fullWidth
                  name="role"
                  value={formData.role || ''}
                  onChange={handleChange}
                  variant="outlined"
                  label="Роль"
                />
              ) : (
                userData.role
              )}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Номер телефона:</strong> {editing ? (
                <TextField
                  fullWidth
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  variant="outlined"
                  label="Телефон"
                />
              ) : (
                userData.phone || '-'
              )}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Должность:</strong> {editing ? (
                <TextField
                  fullWidth
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                  variant="outlined"
                  label="Должность"
                />
              ) : (
                userData.position || '-'
              )}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            {editing ? (
              <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                Сохранить
              </Button>
            ) : (
              <Button variant="outlined" onClick={() => setEditing(true)} sx={{ mt: 2 }}>
                Редактировать
              </Button>
            )}
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button variant="outlined" onClick={logout} sx={{ mt: 2 }}>
              Выйти из профиля
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
