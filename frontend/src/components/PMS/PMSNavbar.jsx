import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Tabs, Tab,
    IconButton, Menu, MenuItem, Avatar, Divider, Chip,
} from '@mui/material';

import HotelIcon from '@mui/icons-material/Hotel';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ROLE_LABELS = {
    manager: 'Manager',
    'front-desk': 'Front Desk',
    housekeeper: 'Housekeeper',
    maintenance: 'Maintenance',
};

const TABS_BY_ROLE = {
    manager: [
        { label: '📊 Dashboard', path: '/pms' },
        { label: '🛏 Rooms', path: '/pms/rooms' },
        { label: '🗓 Calendar', path: '/pms/calendar' },
        { label: '✅ Tasks', path: '/pms/tasks' },
        { label: '👥 Staff', path: '/pms/staff' },
    ],
    'front-desk': [
        { label: '📊 Dashboard', path: '/pms' },
        { label: '🛏 Rooms', path: '/pms/rooms' },
        { label: '🗓 Calendar', path: '/pms/calendar' },
        { label: '✅ Tasks', path: '/pms/tasks' },
    ],
    housekeeper: [
        { label: '✅ My Tasks', path: '/pms/tasks' },
    ],
    maintenance: [
        { label: '✅ My Tasks', path: '/pms/tasks' },
    ],
};


export default function PMSNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    const role = user?.role || 'housekeeper';
    const tabs = TABS_BY_ROLE[role] || TABS_BY_ROLE['housekeeper'];
    const currentTab = tabs.findIndex(t => t.path === location.pathname);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" sx={{ bgcolor: '#0f2044' }} elevation={0}>
            <Toolbar>
                <HotelIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={700} sx={{ mr: 3 }}>
                    PMS
                </Typography>

                <Tabs
                    value={currentTab < 0 ? 0 : currentTab}
                    onChange={(_, i) => navigate(tabs[i].path)}
                    textColor="inherit"
                    TabIndicatorProps={{ style: { backgroundColor: '#4fc3f7' } }}
                    sx={{ flexGrow: 1 }}
                >
                    {tabs.map(tab => (
                        <Tab key={tab.path} label={tab.label} sx={{ fontWeight: 600, minWidth: 'auto', fontSize: '0.82rem' }} />
                    ))}
                </Tabs>

                <Chip
                    label={ROLE_LABELS[role] || role}
                    size="small"
                    sx={{ bgcolor: '#1e3a6e', color: 'white', mr: 1 }}
                />

                <IconButton color="inherit" onClick={e => setAnchorEl(e.currentTarget)}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#4fc3f7', fontSize: '0.85rem' }}>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </Avatar>
                </IconButton>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem disabled>
                        <Typography variant="body2">{user?.firstName} {user?.lastName}</Typography>
                    </MenuItem>
                    <MenuItem disabled>
                        <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
