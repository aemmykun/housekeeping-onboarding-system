import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, Typography, CircularProgress, Alert,
    Chip, Card, CardContent, CardActions, Button,
    Stack, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { tasksApi, staffApi } from '../../utils/pmsApi';

const PRIORITY_COLORS = { urgent: 'error', normal: 'primary', low: 'default' };
const STATUS_LABELS = { pending: '⏳ Pending', 'in-progress': '🔄 In Progress', done: '✅ Done' };
const TYPE_LABELS = {
    clean: '🧹 Clean',
    inspect: '🔍 Inspect',
    maintenance: '🔧 Maintenance',
    restock: '📦 Restock',
    turndown: '🛏 Turndown',
};

const POLL_INTERVAL = 10000;

export default function TaskBoard({ userRole }) {
    const [tasks, setTasks] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const isManager = ['manager', 'front-desk'].includes(userRole);

    const fetchData = useCallback(async () => {
        try {
            const taskData = await tasksApi.getAll();
            setTasks(taskData.tasks);
            if (isManager) {
                const staffData = await staffApi.getAll();
                setStaff(staffData.staff);
            }
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [isManager]);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => {
        const interval = setInterval(fetchData, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleStart = async (taskId) => {
        try { await tasksApi.start(taskId); fetchData(); } catch (e) { setError(e.message); }
    };

    const handleComplete = async (taskId) => {
        try { await tasksApi.complete(taskId); fetchData(); } catch (e) { setError(e.message); }
    };

    const handleAssign = async (taskId, staffId) => {
        try { await tasksApi.assign(taskId, staffId); fetchData(); } catch (e) { setError(e.message); }
    };

    const filtered = tasks.filter(t => filterStatus === 'all' || t.status === filterStatus);

    const columns = {
        pending: filtered.filter(t => t.status === 'pending'),
        'in-progress': filtered.filter(t => t.status === 'in-progress'),
        done: filtered.filter(t => t.status === 'done'),
    };

    if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;

    return (
        <Box>
            <Box display="flex" gap={1} mb={3} flexWrap="wrap" alignItems="center">
                <Typography variant="h6" fontWeight={700} mr={2}>Today's Tasks</Typography>
                {['all', 'pending', 'in-progress', 'done'].map(s => (
                    <Chip
                        key={s}
                        label={s === 'all' ? 'All' : STATUS_LABELS[s]}
                        onClick={() => setFilterStatus(s)}
                        color={filterStatus === s ? 'primary' : 'default'}
                        variant={filterStatus === s ? 'filled' : 'outlined'}
                    />
                ))}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2}>
                {Object.entries(columns).map(([status, columnTasks]) => (
                    <Grid item xs={12} md={4} key={status}>
                        <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 1.5, minHeight: 200 }}>
                            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1.5}>
                                {STATUS_LABELS[status]} ({columnTasks.length})
                            </Typography>
                            <Stack spacing={1.5}>
                                {columnTasks.map(task => (
                                    <Card
                                        key={task._id}
                                        elevation={1}
                                        sx={{ borderLeft: '4px solid', borderColor: `${PRIORITY_COLORS[task.priority] || 'primary'}.main` }}
                                    >
                                        <CardContent sx={{ pb: 0, pt: 1.5, px: 1.5 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Room {task.roomId?.roomNumber}
                                                </Typography>
                                                <Chip label={task.priority} color={PRIORITY_COLORS[task.priority]} size="small" />
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary">
                                                {TYPE_LABELS[task.type] || task.type}
                                            </Typography>
                                            {task.assignedTo && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {'👤 '}{task.assignedTo.firstName} {task.assignedTo.lastName}
                                                </Typography>
                                            )}
                                            {task.notes && (
                                                <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                                                    {task.notes}
                                                </Typography>
                                            )}
                                        </CardContent>
                                        <CardActions sx={{ px: 1.5, pb: 1 }}>
                                            {task.status === 'pending' && (
                                                <Button size="small" startIcon={<PlayArrowIcon />} onClick={() => handleStart(task._id)}>
                                                    Start
                                                </Button>
                                            )}
                                            {task.status === 'in-progress' && (
                                                <Button size="small" color="success" startIcon={<CheckCircleIcon />} onClick={() => handleComplete(task._id)}>
                                                    Done
                                                </Button>
                                            )}
                                            {isManager && task.status !== 'done' && (
                                                <FormControl size="small" sx={{ minWidth: 110, ml: 'auto' }}>
                                                    <InputLabel>Assign</InputLabel>
                                                    <Select
                                                        label="Assign"
                                                        value={task.assignedTo?._id || ''}
                                                        onChange={e => handleAssign(task._id, e.target.value)}
                                                    >
                                                        <MenuItem value=""><em>Unassigned</em></MenuItem>
                                                        {staff.map(s => (
                                                            <MenuItem key={s._id} value={s._id}>
                                                                {s.firstName} {s.lastName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        </CardActions>
                                    </Card>
                                ))}
                                {columnTasks.length === 0 && (
                                    <Typography variant="caption" color="text.disabled" align="center" display="block" mt={2}>
                                        No tasks
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
