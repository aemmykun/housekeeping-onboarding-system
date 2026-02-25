import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Chip,
    CircularProgress, Alert, Avatar, Stack, LinearProgress, Tooltip,
} from '@mui/material';
import { staffApi } from '../../utils/pmsApi';


const ROLE_COLORS = {
    manager: 'primary',
    'front-desk': 'info',
    housekeeper: 'success',
    maintenance: 'warning',
};

const ROLE_LABELS = {
    manager: 'Manager',
    'front-desk': 'Front Desk',
    housekeeper: 'Housekeeper',
    maintenance: 'Maintenance',
};

export default function StaffList() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        staffApi.getAll()
            .then(data => setStaff(data.staff))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    const grouped = staff.reduce((acc, s) => {
        const r = s.role;
        if (!acc[r]) acc[r] = [];
        acc[r].push(s);
        return acc;
    }, {});

    return (
        <Box>
            {Object.entries(grouped).map(([role, members]) => (
                <Box key={role} mb={4}>
                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary" mb={1.5}>
                        {ROLE_LABELS[role] || role} ({members.length})
                    </Typography>
                    <Grid container spacing={2}>
                        {members.map(s => {
                            const progress = s.todayTasks ? Math.round((s.doneTasks / s.todayTasks) * 100) : 0;
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={s._id}>
                                    <Card elevation={2} sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                                                <Avatar sx={{ bgcolor: `${ROLE_COLORS[s.role] || 'grey'}.main`, width: 40, height: 40 }}>
                                                    {s.firstName?.[0]}{s.lastName?.[0]}
                                                </Avatar>
                                                <Box flex={1} minWidth={0}>
                                                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                                                        {s.firstName} {s.lastName}
                                                    </Typography>
                                                    <Chip
                                                        label={ROLE_LABELS[s.role] || s.role}
                                                        color={ROLE_COLORS[s.role] || 'default'}
                                                        size="small"
                                                    />
                                                </Box>
                                            </Stack>

                                            {s.phone && (
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    📞 {s.phone}
                                                </Typography>
                                            )}

                                            {s.todayTasks > 0 && (
                                                <Box mt={1.5}>
                                                    <Stack direction="row" justifyContent="space-between" mb={0.25}>
                                                        <Typography variant="caption" color="text.secondary">Today's tasks</Typography>
                                                        <Typography variant="caption" fontWeight={600}>
                                                            {s.doneTasks}/{s.todayTasks}
                                                        </Typography>
                                                    </Stack>
                                                    <Tooltip title={`${progress}% complete`}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={progress}
                                                            color={progress === 100 ? 'success' : 'primary'}
                                                            sx={{ borderRadius: 1, height: 6 }}
                                                        />
                                                    </Tooltip>
                                                </Box>
                                            )}

                                            {s.todayTasks === 0 && (
                                                <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                                                    No tasks assigned today
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            ))}
        </Box>
    );
}
