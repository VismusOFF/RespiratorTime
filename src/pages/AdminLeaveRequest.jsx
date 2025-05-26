import React, { useEffect, useState } from 'react';
import { database } from '../assets/firebase';
import { ref, onValue, update } from 'firebase/database';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  TableSortLabel,
} from '@mui/material';

const AdminLeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('createdAt');

  useEffect(() => {
    const leaveRequestsRef = ref(database, 'leaveRequests');

    const unsubscribe = onValue(
      leaveRequestsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const requestsArray = [];

          // Преобразуем вложенные объекты в плоский массив заявок
          for (const userId in data) {
            const userRequests = data[userId];
            for (const requestId in userRequests) {
              const request = userRequests[requestId];
              requestsArray.push({
                id: requestId,
                userId,
                ...request,
              });
            }
          }

          setLeaveRequests(requestsArray);
        } else {
          setLeaveRequests([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Ошибка при загрузке заявок: ', error);
        setErrorMsg('Ошибка при загрузке заявок. Попробуйте позже.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (request, newStatus) => {
    try {
      const leaveRequestRef = ref(database, `leaveRequests/${request.userId}/${request.id}`);
      await update(leaveRequestRef, { status: newStatus });
      setLeaveRequests((prev) =>
        prev.map((r) =>
          r.id === request.id && r.userId === request.userId ? { ...r, status: newStatus } : r
        )
      );
    } catch (error) {
      console.error('Ошибка при изменении статуса: ', error);
      setErrorMsg('Ошибка при изменении статуса заявки. Попробуйте позже.');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredRequests = leaveRequests.filter((request) => {
    return filter === '' || request.status === filter;
  });

  const sortedRequests = filteredRequests.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false} // чтобы контейнер растягивался на всю ширину
      disableGutters
      sx={{
        height: '90vh', // высота всего окна
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}
    >
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <Box display="flex" sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Фильтр по статусу</InputLabel>
          <Select value={filter} onChange={handleFilterChange} label="Фильтр по статусу">
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="новая">Новая</MenuItem>
            <MenuItem value="одобрена">Одобрена</MenuItem>
            <MenuItem value="отклонена">Отклонена</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper
        sx={{
          flexGrow: 1, // занимает всё оставшееся пространство
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <TableContainer
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
          }}
        >
          <Table stickyHeader aria-label="таблица заявок">
            <TableHead>
        <TableRow>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'fullName'}
              direction={orderBy === 'fullName' ? order : 'asc'}
              onClick={() => handleRequestSort('fullName')}
            >
              ФИО
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'email'}
              direction={orderBy === 'email' ? order : 'asc'}
              onClick={() => handleRequestSort('email')}
            >
              Email
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'phone'}
              direction={orderBy === 'phone' ? order : 'asc'}
              onClick={() => handleRequestSort('phone')}
            >
              Телефон
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'position'}
              direction={orderBy === 'position' ? order : 'asc'}
              onClick={() => handleRequestSort('position')}
            >
              Должность
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'role'}
              direction={orderBy === 'role' ? order : 'asc'}
              onClick={() => handleRequestSort('role')}
            >
              Роль
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'startDate'}
              direction={orderBy === 'startDate' ? order : 'asc'}
              onClick={() => handleRequestSort('startDate')}
            >
              Дата начала
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'endDate'}
              direction={orderBy === 'endDate' ? order : 'asc'}
              onClick={() => handleRequestSort('endDate')}
            >
              Дата окончания
            </TableSortLabel>
          </TableCell>
          <TableCell>Комментарий</TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'status'}
              direction={orderBy === 'status' ? order : 'asc'}
              onClick={() => handleRequestSort('status')}
            >
              Статус
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={orderBy === 'createdAt'}
              direction={orderBy === 'createdAt' ? order : 'asc'}
              onClick={() => handleRequestSort('createdAt')}
            >
              Создано
            </TableSortLabel>
          </TableCell>
          <TableCell>Действия</TableCell>
        </TableRow>
      </TableHead>
            <TableBody>
              {sortedRequests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => (
                  <TableRow key={`${request.userId}_${request.id}`}>
                    {/* ваши TableCell с данными */}
                    <TableCell>{request.fullName}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{request.position}</TableCell>
                    <TableCell>{request.role}</TableCell>
                    <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{request.comment}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <FormControl variant="outlined" size="small">
                        <Select
                          value={request.status}
                          onChange={(event) => handleStatusChange(request, event.target.value)}
                        >
                          <MenuItem value="новая">Новая</MenuItem>
                          <MenuItem value="одобрена">Одобрена</MenuItem>
                          <MenuItem value="отклонена">Отклонена</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              {sortedRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    Заявок нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default AdminLeaveRequests;
