import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, LinearProgress,
    CircularProgress, Alert, Stack, Avatar, Chip, Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { staffApi } from '../../utils/pmsApi';

const ROLE_COLORS = {
    manager: 'primary',
    'front-desk': 'info',
    housekeeper: 'success',
    maintenance: 'warning',
};

function StatusIcon({ done, total }) {
    if (total === 0) return <HourglassEmptyIcon fontSize="small" sx={{ color: 'text.disabled' }} />;
    if (done === total) return <CheckCircleIcon fontSize="small" color="success" />;
    if (done / total >= 0.5) return <HourglassEmptyIcon fontSize="small" color="warning" />;
    return <WarningAmberIcon fontSize="small" color="error" />;
}

function formatMinutes(mins) {
    if (!mins || mins <= 0) return '—';
    if (mins < 60) return `${Math.round(mins)}m`;
    return `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`;
}

export default function StaffPerformance() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = () => {
        staffApi.getPerformance()
            .then(data => {
                setStats(data.stats || []);
                setLastUpdated(new Date());
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
        const timer = setInterval(fetchData, 30000); // poll every 30s
        return () => clearInterval(timer);
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    if (stats.length === 0) {
        return (
            <Box py={6} textAlign="center">
                <HourglassEmptyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">No task data for today yet.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                    Today's task completion — auto-refreshes every 30s
                </Typography>
                {lastUpdated && (
                    <Typography variant="caption" color="text.disabled">
                        Updated {lastUpdated.toLocaleTimeString()}
                    </Typography>
                )}
            </Stack>

            <Grid container spacing={2}>
                {stats.map((s) => {
                    const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
                    const color = pct === 100 ? 'success' : pct >= 50 ? 'warning' : 'error';

                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={s.staffId}>
                            <Card elevation={2} sx={{ height: '100%', borderTop: 3, borderColor: `${color}.main` }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                                        <Avatar sx={{ bgcolor: `${ROLE_COLORS[s.role] || 'grey'}.main`, width: 38, height: 38, fontSize: '0.85rem' }}>
                                            {s.name?.split(' ').map(n => n[0]).join('')}
                                        </Avatar>
                                        <Box flex={1} minWidth={0}>
                                            <Typography variant="subtitle2" fontWeight={700} noWrap>{s.name}</Typography>
                                            <Chip label={s.role} size="small" color={ROLE_COLORS[s.role] || 'default'} />
                                        </Box>
                                        <StatusIcon done={s.done} total={s.total} />
                                    </Stack>

                                    {/* Task count */}
                                    <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                        <Typography variant="caption" color="text.secondary">Tasks done</Typography>
                                        <Typography variant="caption" fontWeight={700}>
                                            {s.done} / {s.total}
                                        </Typography>
                                    </Stack>
                                    <Tooltip title={`${pct}% complete`}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={pct}
                                            color={color}
                                            sx={{ borderRadius: 1, height: 8, mb: 1.5 }}
                                        />
                                    </Tooltip>

                                    {/* Avg turnaround */}
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">Avg turnaround</Typography>
                                        <Typography variant="caption" fontWeight={600} color={s.avgMinutes ? 'text.primary' : 'text.disabled'}>
                                            {formatMinutes(s.avgMinutes)}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
