import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel, FormGroup, Button } from '@mui/material';

const UserDialog = ({ open, onClose, user, workSchedule, setWorkSchedule, activity, setActivity, downtime, productivity, setDowntime, setProductivity, overtime, setOvertime, absences, setAbsences, handleScheduleChange, toggleDay, handleRoleChange }) => {
  const [workDays, setWorkDays] = React.useState(user?.workDays || 0);

  const updateCalculations = (activityInput) => {
    const activityHours = parseActivityInput(activityInput) + parseFloat(overtime || 0);
    const effectiveWorkDays = workDays - (parseInt(absences, 10) || 0);
    const totalWorkHours = effectiveWorkDays > 0 ? effectiveWorkDays * 24 : 0;

    const downtimeHours = totalWorkHours - activityHours;
    const downtimeHoursPositive = downtimeHours > 0 ? downtimeHours : 0;
    const productivityPercentage = totalWorkHours > 0 ? (activityHours / totalWorkHours) * 100 : 0;

    setDowntime(`${Math.floor(downtimeHoursPositive)}ч`);
    setProductivity(productivityPercentage.toFixed(2));
  };

  const parseActivityInput = (input) => {
    const hours = parseInt(input, 10) || 0;
    return hours;
  };

  const handleActivityChange = (e) => {
    const newActivity = e.target.value;
    setActivity(newActivity);
    updateCalculations(newActivity);
  };

  const handleWorkDaysChange = (e) => {
    const newWorkDays = parseInt(e.target.value, 10) || 0;
    setWorkDays(newWorkDays);
    updateCalculations(activity);
  };

  const handleOvertimeChange = (e) => {
    setOvertime(e.target.value);
    updateCalculations(activity);
  };

  const handleAbsencesChange = (e) => {
    setAbsences(e.target.value);
    updateCalculations(activity);
  };

  React.useEffect(() => {
    if (user) {
      setWorkDays(user.workDays || 0);
      updateCalculations(activity);
    }
  }, [user]);

  React.useEffect(() => {
    updateCalculations(activity);
  }, [workDays, activity, absences, overtime]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Изменить график для {user?.fullName}</DialogTitle>
      <DialogContent>
        <FormGroup>
          {['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'].map(day => (
            <FormControlLabel
              key={day}
              control={
                <Checkbox
                  checked={workSchedule.includes(day)}
                  onChange={() => toggleDay(day)}
                />
              }
              label={day}
            />
          ))}
        </FormGroup>
        <TextField
          label="Рабочие дни"
          type="number"
          value={workDays}
          onChange={handleWorkDaysChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Активность (часы)"
          value={activity}
          onChange={handleActivityChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Простой"
          value={downtime}
          disabled
          fullWidth
          margin="normal"
        />
        <TextField
          label="% активности"
          type="number"
          value={productivity}
          disabled
          fullWidth
          margin="normal"
        />
        <TextField
          label="Переработка (часы)"
          value={overtime}
          onChange={handleOvertimeChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Прогулы"
          type="number"
          value={absences}
          onChange={handleAbsencesChange}
          fullWidth
          margin="normal"
        />
        <div style={{ marginTop: 16 }}>
          <Checkbox
            checked={user?.role === 'Администратор'}
            onChange={(e) => handleRoleChange(user.id, e.target.checked ? 'Администратор' : 'Сотрудник')}
          />
          Администратор
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleScheduleChange} variant="contained" color="primary">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;
