import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Grid, Chip, CircularProgress,
    Alert, IconButton, Stack, Tooltip, Popover, Button,
    ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import { staffApi } from '../../utils/pmsApi';

const SHIFT_TYPES = [
    { value: 'morning', label: '🌅 Morning', color: '#fff3e0', border: '#fb8c00' },
    { value: 'afternoon', label: '☀️ Afternoon', color: '#e3f2fd', border: '#1976d2' },
    { value: 'night', label: '🌙 Night', color: '#ede7f6', border: '#7b1fa2' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sun
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

function toDateStr(date) {
    return date.toISOString().slice(0, 10);
}

export default function ShiftScheduler({ staff = [] }) {
    const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverCell, setPopoverCell] = useState(null); // { staffId, date, existingShift }
    const [saving, setSaving] = useState(false);

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const fetchShifts = useCallback(() => {
        const startDate = toDateStr(weekStart);
        const endDate = toDateStr(addDays(weekStart, 6));
        staffApi.getShifts({ startDate, endDate })
            .then(data => setShifts(data.shifts || []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [weekStart]);

    useEffect(() => {
        setLoading(true);
        fetchShifts();
    }, [fetchShifts]);

    const getShiftForCell = (staffId, date) =>
        shifts.find(s =>
            s.staffId?._id === staffId &&
            toDateStr(new Date(s.date)) === toDateStr(date)
        );

    const openPopover = (e, staffMember, date) => {
        const existing = getShiftForCell(staffMember._id, date);
        setPopoverCell({ staffMember, date, existing });
        setAnchorEl(e.currentTarget);
    };

    const closePopover = () => {
        setAnchorEl(null);
        setPopoverCell(null);
    };

    const handleAssign = async (shiftType) => {
        if (!popoverCell) return;
        setSaving(true);
        try {
            await staffApi.createShift({
                staffId: popoverCell.staffMember._id,
                date: toDateStr(popoverCell.date),
                shiftType,
            });
            fetchShifts();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
            closePopover();
        }
    };

    const handleRemove = async () => {
        if (!popoverCell?.existing) return;
        setSaving(true);
        try {
            await staffApi.deleteShift(popoverCell.existing._id);
            fetchShifts();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
            closePopover();
        }
    };

    const isToday = (date) => toDateStr(date) === toDateStr(new Date());

    if (loading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            {/* Week navigation */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <IconButton onClick={() => setWeekStart(d => addDays(d, -7))} size="small">
                    <ChevronLeftIcon />
                </IconButton>
                <Typography variant="subtitle1" fontWeight={700} minWidth={200} textAlign="center">
                    {weekStart.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    {' – '}
                    {addDays(weekStart, 6).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
                <IconButton onClick={() => setWeekStart(d => addDays(d, 7))} size="small">
                    <ChevronRightIcon />
                </IconButton>
                <Tooltip title="Jump to today">
                    <IconButton onClick={() => setWeekStart(getWeekStart(new Date()))} size="small">
                        <TodayIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Paper variant="outlined" sx={{ overflow: 'auto' }}>
                <Box sx={{ minWidth: 700 }}>
                    {/* Header row */}
                    <Grid container sx={{ borderBottom: '2px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                        <Grid item sx={{ width: 140, flexShrink: 0, p: 1.5 }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">STAFF</Typography>
                        </Grid>
                        {weekDays.map((d, i) => (
                            <Grid item xs key={i} sx={{ p: 1.5, textAlign: 'center', borderLeft: '1px solid', borderColor: 'divider', bgcolor: isToday(d) ? '#e3f2fd' : undefined }}>
                                <Typography variant="caption" fontWeight={700} color={isToday(d) ? 'primary' : 'text.secondary'}>
                                    {DAYS[i]}
                                </Typography>
                                <Typography variant="caption" display="block" color={isToday(d) ? 'primary' : 'text.secondary'}>
                                    {d.getDate()}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Staff rows */}
                    {staff.length === 0 && (
                        <Box py={4} textAlign="center">
                            <Typography color="text.secondary">No staff found. Add staff members first.</Typography>
                        </Box>
                    )}
                    {staff.map((member, ri) => (
                        <Grid container key={member._id} sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                            <Grid item sx={{ width: 140, flexShrink: 0, p: 1.5, display: 'flex', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body2" fontWeight={600} noWrap>{member.firstName} {member.lastName}</Typography>
                                    <Typography variant="caption" color="text.secondary">{member.role}</Typography>
                                </Box>
                            </Grid>
                            {weekDays.map((day, di) => {
                                const shift = getShiftForCell(member._id, day);
                                const shiftDef = SHIFT_TYPES.find(s => s.value === shift?.shiftType);
                                return (
                                    <Grid item xs key={di} sx={{ borderLeft: '1px solid', borderColor: 'divider', bgcolor: isToday(day) ? '#f5fbff' : ri % 2 ? 'grey.50' : undefined }}>
                                        <Tooltip title={shift ? `Click to change — ${shiftDef?.label}` : 'Click to assign shift'}>
                                            <Box
                                                onClick={(e) => openPopover(e, member, day)}
                                                sx={{
                                                    height: 52,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.15s',
                                                    bgcolor: shiftDef ? shiftDef.color : undefined,
                                                    borderLeft: shiftDef ? `3px solid ${shiftDef.border}` : undefined,
                                                    '&:hover': { bgcolor: shiftDef ? shiftDef.color : 'action.hover' },
                                                }}
                                            >
                                                {shift ? (
                                                    <Typography variant="caption" fontWeight={600} color="text.primary">
                                                        {shiftDef?.label || shift.shiftType}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">—</Typography>
                                                )}
                                            </Box>
                                        </Tooltip>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ))}
                </Box>
            </Paper>

            {/* Shift assignment popover */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Box p={2} minWidth={200}>
                    <Typography variant="subtitle2" fontWeight={700} mb={1}>
                        {popoverCell?.staffMember?.firstName} — {popoverCell?.date?.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </Typography>
                    <ToggleButtonGroup orientation="vertical" exclusive fullWidth size="small" sx={{ mb: 1 }}>
                        {SHIFT_TYPES.map(s => (
                            <ToggleButton key={s.value} value={s.value} onClick={() => handleAssign(s.value)} disabled={saving} sx={{ justifyContent: 'flex-start' }}>
                                {s.label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                    {popoverCell?.existing && (
                        <Button fullWidth size="small" color="error" onClick={handleRemove} disabled={saving}>
                            Remove shift
                        </Button>
                    )}
                </Box>
            </Popover>

            {/* Legend */}
            <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                {SHIFT_TYPES.map(s => (
                    <Chip key={s.value} label={s.label} size="small" sx={{ bgcolor: s.color, border: `1px solid ${s.border}` }} />
                ))}
            </Stack>
        </Box>
    );
}
