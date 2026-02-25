import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import './App.css';

// Auth components
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';

// Module components
import ModuleList from './components/Modules/ModuleList';
import ModuleViewer from './components/Modules/ModuleViewer';
import ModuleEditor from './components/Modules/ModuleEditor';

// PMS components
import { DashboardPage, RoomsPage, TasksPage, StaffPage, CalendarPage } from './components/PMS/PMSLayout';


const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "PLACEHOLDER_ID"}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/modules" element={<ModuleList />} />
              <Route path="/modules/:id" element={<ModuleViewer />} />
              <Route
                path="/modules/:id/edit"
                element={
                  <ProtectedRoute>
                    <ModuleEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/modules/new"
                element={
                  <ProtectedRoute>
                    <ModuleEditor />
                  </ProtectedRoute>
                }
              />
              {/* PMS Routes */}
              <Route path="/pms" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/pms/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
              <Route path="/pms/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
              <Route path="/pms/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
              <Route path="/pms/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Box textAlign="center" py={8}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>
              🏨 Housekeeping Onboarding System
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
              Transform your training with gamification, AR/VR, and social learning
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          ✨ Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <FeatureCard
              icon={<EmojiEventsIcon sx={{ fontSize: 48 }} />}
              title="Gamification"
              description="Earn badges, points, and compete on leaderboards"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <FeatureCard
              icon={<PhoneAndroidIcon sx={{ fontSize: 48 }} />}
              title="Mobile-First"
              description="Learn anywhere with offline capability"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <FeatureCard
              icon={<SchoolIcon sx={{ fontSize: 48 }} />}
              title="AR/VR Training"
              description="Immersive equipment scanning and simulations"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <FeatureCard
              icon={<GroupsIcon sx={{ fontSize: 48 }} />}
              title="Social Learning"
              description="Connect with mentors and peers"
            />
          </Grid>
        </Grid>
      </Container>

      {/* Status Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              🚀 System Status
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your development environment is ready!
            </Typography>
            <Box mt={3}>
              <Typography variant="body2">
                API Backend: <strong>Ready</strong> • Database: <strong>Pending Setup</strong>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mt: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            Built with ❤️ for the hospitality industry • © 2026 Housekeeping Onboarding System
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
      <Box sx={{ color: 'primary.main', mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
}

export default App;
