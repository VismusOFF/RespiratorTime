import React, { useEffect, useState } from 'react';
import { useUser  } from '../context/UserContext';
import { database } from '../assets/firebase';
import { ref, onValue } from 'firebase/database';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';

const LeaveRequestsView = () => {
  const { user } = useUser ();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = () => {
      if (!user) {
        setLoading(false); // Устанавливаем loading в false, если пользователь не авторизован
        return;
      }

      const leaveRequestsRef = ref(database, `leaveRequests/${user.uid}`);

      const unsubscribe = onValue(leaveRequestsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const requestsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          requestsArray.sort((a, b) => b.createdAt - a.createdAt);
          setLeaveRequests(requestsArray);
        } else {
          setLeaveRequests([]);
        }
        setLoading(false);
      }, (error) => {
        console.error('Ошибка при загрузке заявок: ', error);
        setErrorMsg('Ошибка при загрузке заявок. Попробуйте позже.');
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Ваши заявки на отпуск
        </Typography>

        {errorMsg && (
          <Alert severity="error">{errorMsg}</Alert>
        )}

        {leaveRequests.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            У вас нет заявок на отпуск.
          </Typography>
        ) : (
          <List>
            {leaveRequests.map((request) => (
              <ListItem key={request.id}>
                <ListItemText
                  primary={`Дата начала: ${request.startDate}, Дата окончания: ${request.endDate}`}
                  secondary={`Статус: ${request.status}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default LeaveRequestsView;
