import React from 'react';
import { Box, Container } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PMSNavbar from './PMSNavbar';
import PMSDashboard from './PMSDashboard';
import RoomGrid from '../Rooms/RoomGrid';
import TaskBoard from '../Staff/TaskBoard';
import StaffList from '../Staff/StaffList';

const HOUSEKEEPER_ROLES = ['housekeeper', 'maintenance'];


// Route guard for the PMS section
export function PMSRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/pms/tasks" replace />;
    return children;
}

// Shared layout wrapper — Navbar + content area
export function PMSLayout({ children }) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f0f4f8' }}>
            <PMSNavbar />
            <Container maxWidth="xl" sx={{ py: 3 }}>
                {children}
            </Container>
        </Box>
    );
}

// Page components used by App.js routes
export function DashboardPage() {
    const { user } = useAuth();
    // Housekeepers land directly on tasks
    if (HOUSEKEEPER_ROLES.includes(user?.role)) return <Navigate to="/pms/tasks" replace />;
    return <PMSLayout><PMSDashboard /></PMSLayout>;
}

export function RoomsPage() {
    const { user } = useAuth();
    return (
        <PMSLayout>
            <RoomGrid userRole={user?.role} />
        </PMSLayout>
    );
}

export function TasksPage() {
    const { user } = useAuth();
    return (
        <PMSLayout>
            <TaskBoard userRole={user?.role} userId={user?.id} />
        </PMSLayout>
    );
}

export function StaffPage() {
    return (
        <PMSLayout>
            <StaffList />
        </PMSLayout>
    );
}
