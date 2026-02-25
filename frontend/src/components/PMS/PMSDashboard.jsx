import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Paper, Typography, CircularProgress,
    Divider, List, ListItem, ListItemText, Chip, Stack,
} from '@mui/material';
import KingBedIcon from '@mui/icons-material/KingBed';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

import { roomsApi, bookingsApi } from '../../utils/pmsApi';

const StatCard = ({ icon, label, value, color }) => (
    <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, borderLeft: `4px solid ${color}`, height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ color, fontSize: 32 }}>{icon}</Box>
            <Box>
                <Typography variant="h4" fontWeight={700}>{value}</Typography>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
            </Box>
        </Stack>
    </Paper>
);

const POLL = 10000;

export default function PMSDashboard() {
    const [summary, setSummary] = useState(null);
    const [today, setToday] = useState({ arrivals: [], departures: [] });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [sumData, todayData] = await Promise.all([
                roomsApi.getSummary(),
                bookingsApi.getToday(),
            ]);
            setSummary(sumData.summary);
            setToday(todayData);
        } catch (err) {
            console.error('Dashboard fetch error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);
    useEffect(() => {
        const interval = setInterval(fetchData, POLL);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>🏨 Today's Overview</Typography>

            {/* KPI Row */}
            <Grid container spacing={2} mb={4}>
                <Grid item xs={6} sm={3}>
                    <StatCard icon={<KingBedIcon />} label="Occupancy" value={`${summary?.occupancyPercent || 0}%`} color="#f44336" />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard icon="🟢" label="Available" value={summary?.available || 0} color="#4caf50" />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard icon={<CleaningServicesIcon />} label="Need Cleaning" value={(summary?.dirty || 0) + (summary?.cleaning || 0)} color="#ff9800" />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <StatCard icon="🔧" label="Maintenance" value={summary?.maintenance || 0} color="#9e9e9e" />
                </Grid>
            </Grid>

            {/* Arrivals & Departures */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ bgcolor: 'success.main', px: 2, py: 1.5 }}>
                            <Typography variant="subtitle1" fontWeight={700} color="white">
                                ✈️ Arrivals Today ({today.arrivals?.length || 0})
                            </Typography>
                        </Box>
                        <List dense disablePadding>
                            {(today.arrivals || []).length === 0 && (
                                <ListItem><ListItemText secondary="No arrivals today" /></ListItem>
                            )}
                            {(today.arrivals || []).map(b => (
                                <React.Fragment key={b._id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={b.guestName}
                                            secondary={`Room ${b.roomId?.roomNumber} · ${b.roomId?.type}`}
                                        />
                                        <Chip label="Arriving" color="success" size="small" />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ bgcolor: 'warning.main', px: 2, py: 1.5 }}>
                            <Typography variant="subtitle1" fontWeight={700} color="white">
                                🚪 Departures Today ({today.departures?.length || 0})
                            </Typography>
                        </Box>
                        <List dense disablePadding>
                            {(today.departures || []).length === 0 && (
                                <ListItem><ListItemText secondary="No departures today" /></ListItem>
                            )}
                            {(today.departures || []).map(b => (
                                <React.Fragment key={b._id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={b.guestName}
                                            secondary={`Room ${b.roomId?.roomNumber} · ${b.roomId?.type}`}
                                        />
                                        <Chip label="Departing" color="warning" size="small" />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
