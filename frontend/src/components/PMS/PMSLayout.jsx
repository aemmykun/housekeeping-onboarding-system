import React, { useState } from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { Navigate as NavRedirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PMSNavbar from './PMSNavbar';
import PMSDashboard from './PMSDashboard';
import RoomGrid from '../Rooms/RoomGrid';
import BookingCalendar from '../Rooms/BookingCalendar';
import TaskBoard from '../Staff/TaskBoard';
import StaffList from '../Staff/StaffList';
import ShiftScheduler from '../Staff/ShiftScheduler';
import StaffPerformance from '../Staff/StaffPerformance';
import { staffApi } from '../../utils/pmsApi';


const HOUSEKEEPER_ROLES = ['housekeeper', 'maintenance'];

// Route guard for the PMS section
export function PMSRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <NavRedirect to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <NavRedirect to="/pms/tasks" replace />;
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
    if (HOUSEKEEPER_ROLES.includes(user?.role)) return <NavRedirect to="/pms/tasks" replace />;
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

// Staff page — tabs: Staff List | Shift Scheduler | Performance
export function StaffPage() {
    const [tab, setTab] = useState(0);
    const [staff, setStaff] = React.useState([]);

    React.useEffect(() => {
        staffApi.getAll()
            .then(data => setStaff(data.staff || []))
            .catch(() => { });
    }, []);

    return (
        <PMSLayout>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="👥 Staff List" />
                <Tab label="📅 Shift Scheduler" />
                <Tab label="📊 Performance" />
            </Tabs>
            {tab === 0 && <StaffList />}
            {tab === 1 && <ShiftScheduler staff={staff} />}
            {tab === 2 && <StaffPerformance />}
        </PMSLayout>
    );
}

// Booking Calendar page
export function CalendarPage() {
    return (
        <PMSLayout>
            <BookingCalendar />
        </PMSLayout>
    );
}
