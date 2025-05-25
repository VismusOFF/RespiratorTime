import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-calendar';
import { ref, onValue } from 'firebase/database';
import { database } from '../assets/firebase';
import { useUser  } from '../context/UserContext';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css';

const daysOfWeekRu = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

const CalendarPage = () => {
  const { user } = useUser ();
  const [value, setValue] = useState(new Date());
  const [workDaysOfWeek, setWorkDaysOfWeek] = useState([]);

  useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.schedule) {
          setWorkDaysOfWeek(userData.schedule);
        } else {
          setWorkDaysOfWeek([]);
        }
      });
    }
  }, [user]);

  const tileClassName = ({ date }) => {
    const dayName = daysOfWeekRu[date.getDay()];
    return workDaysOfWeek.includes(dayName) ? 'highlight' : null;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={tileClassName}
      />
      <div className="info-container">
        <h2>Информация</h2>
        <p><strong>Перерыв на обед:</strong> с 12:00 до 14:00</p>
        <p><strong>Выходные:</strong> Суббота и Воскресенье</p>
      </div>
    </div>
  );
};

export default CalendarPage;
