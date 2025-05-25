import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../assets/firebase';
import UserDialog from './UserDialog';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import GetAppIcon from '@mui/icons-material/GetApp'; // Иконка скачивания
import DescriptionIcon from '@mui/icons-material/Description'; // Иконка документа Word

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [workSchedule, setWorkSchedule] = useState([]);
  const [activity, setActivity] = useState('');
  const [downtime, setDowntime] = useState('');
  const [productivity, setProductivity] = useState(0);
  const [overtime, setOvertime] = useState('');
  const [absences, setAbsences] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  // Функция для экспорта данных в Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users.xlsx');
  };

  // Функция для экспорта данных в Word
  const handleExportWord = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: 'Список пользователей',
              heading: 'Heading1',
            }),
            ...users.map(user =>
              new Paragraph({
                children: [
                  new TextRun(`ID: ${user.id}`),
                  new TextRun(` ФИО: ${user.fullName}`),
                  new TextRun(` Номер телефона: ${user.phone}`),
                  new TextRun(` Должность: ${user.position}`),
                  new TextRun(` Роль: ${user.role}`),
                  new TextRun(` Активность: ${user.activity}`),
                  new TextRun(` Простой: ${user.downtime}`),
                  new TextRun(` % активности: ${user.productivity}`),
                  new TextRun(` Переработка: ${user.overtime}`),
                  new TextRun(` Прогулы: ${user.absences}`),
                  new TextRun(` Рабочие дни: ${user.workDays}`),
                ],
              })
            ),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'users.docx';
      link.click();
    });
  };

  useEffect(() => {
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const usersArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
        schedule: data[key].schedule ? Object.values(data[key].schedule) : [],
        workDays: data[key].workDays || 0,
      }));
      setUsers(usersArray);
    });
  }, []);

  const handleOpen = (user) => {
    setSelectedUser(user);
    const scheduleArray = user.schedule || [];
    setWorkSchedule(scheduleArray);
    setActivity(user.activity || '');
    setDowntime(user.downtime || '');
    setProductivity(user.productivity || 0);
    setOvertime(user.overtime || '');
    setAbsences(user.absences || 0);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setWorkSchedule([]);
    setActivity('');
    setDowntime('');
    setProductivity(0);
    setOvertime('');
    setAbsences(0);
  };

  const handleScheduleChange = async () => {
    const userRef = ref(database, `users/${selectedUser.id}`);
    const workDaysCount = workSchedule.length;

    await update(userRef, {
      schedule: workSchedule,
      workDays: workDaysCount,
      activity,
      downtime,
      productivity,
      overtime,
      absences,
    });
    handleClose();
  };

  const toggleDay = (day) => {
    if (workSchedule.includes(day)) {
      setWorkSchedule(workSchedule.filter(d => d !== day));
    } else {
      setWorkSchedule([...workSchedule, day]);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, { role: newRole });
    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'fullName', headerName: 'ФИО', width: 200 },
    { field: 'phone', headerName: 'Номер телефона', width: 150 },
    { field: 'position', headerName: 'Должность', width: 150 },
    { field: 'role', headerName: 'Роль', width: 150 },
    { field: 'activity', headerName: 'Активность', width: 150 },
    { field: 'downtime', headerName: 'Простой', width: 150 },
    { field: 'productivity', headerName: '% активности', width: 150 },
    { field: 'overtime', headerName: 'Переработка', width: 150 },
    { field: 'absences', headerName: 'Прогулы', width: 150 },
    { field: 'workDays', headerName: 'Рабочие дни', width: 150 },
    {
      field: 'edit',
      headerName: 'Редактировать',
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => handleOpen(params.row)}>Изменить график</Button>
      ),
    },
  ];

  return (
    <div style={{  width: '100%' }}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        checkboxSelection
        onSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection);
        }}
      />
      <Button sx={{ml: '5px'}}
        variant="contained"
        color="success"
        startIcon={<GetAppIcon />}
        onClick={handleExportExcel}
        style={{ marginTop: 20, marginRight: 10 }}
      >
        Экспорт в Excel
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<DescriptionIcon />}
        onClick={handleExportWord}
        style={{ marginTop: 20 }}
      >
        Экспорт в Word
      </Button>
      <UserDialog
        open={open}
        onClose={handleClose}
        user={selectedUser}
        workSchedule={workSchedule}
        setWorkSchedule={setWorkSchedule}
        activity={activity}
        setActivity={setActivity}
        downtime={downtime}
        productivity={productivity}
        setDowntime={setDowntime}
        setProductivity={setProductivity}
        overtime={overtime}
        setOvertime={setOvertime}
        absences={absences}
        setAbsences={setAbsences}
        handleScheduleChange={handleScheduleChange}
        toggleDay={toggleDay}
        handleRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default AdminPanel;
