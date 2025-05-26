import { useState } from 'react';
import './App.css';
import SignIn from './components/auth/SignIn';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './components/auth/SignUp';
import Navbar from './components/navbar/Navbar';
import { UserProvider } from './context/UserContext';
import Profile from './components/auth/Profile';
import ProtectedRoute from './routes/ProtectedRoute'; // Импортируем новый компонент
import AdminPanel from './components/admin/AdminPanel'; // Импортируем компонент AdminPanel
import CalendarPage from './pages/CalendarPage'
import ResetPassword from './components/auth/ResetPass';
import LeaveRequest from './pages/LeaveRequest';
import LeaveRequestsView from './pages/LeaveRequestView';
import AdminLeaveRequests from './pages/AdminLeaveRequest';

// Create a light theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Quicksand", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <UserProvider>
          <Navbar />
          <Routes>
            <Route path='/signIn' element={<SignIn />} />
            <Route path='/signUp' element={<SignUp />} />
            <Route path='/reset-password' element={<ResetPassword/>} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/leave-request' element={<LeaveRequest/>} />
            <Route path='/leave-request-view' element={<LeaveRequestsView/>} />
            <Route path='/admin-leave-request' element={<AdminLeaveRequests/>} />
            <Route path='/work-schedule' element={<CalendarPage />} /> {/* Используем CalendarPage напрямую */}
            <Route
              path='/admin'
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
