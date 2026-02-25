import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, CircularProgress, Alert,
    Stack, IconButton, Tooltip, Chip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import { roomsApi } from '../../utils/pmsApi';


function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

function toDateStr(date) {
    return date.toISOString().slice(0, 10);
}

function isToday(date) {
    return toDateStr(date) === toDateStr(new Date());
}

const STATUS_COLORS = {
    available: '#e8f5e9',
    occupied: '#ffebee',
    dirty: '#fff8e1',
    cleaning: '#e3f2fd',
    maintenance: '#fce4ec',
};

export default function BookingCalendar({ onCheckIn, onCheckOut }) {
    const [weekStart, setWeekStart] = useState(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });
    const [calendarData, setCalendarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const fetchData = useCallback(() => {
        roomsApi.getCalendar(toDateStr(weekStart), toDateStr(addDays(weekStart, 6)))
            .then(data => setCalendarData(data.calendar || []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [weekStart]);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    const getBookingForCell = (room, day) => {
        const dayStr = toDateStr(day);
        return room.bookings?.find(b => {
            const ci = toDateStr(new Date(b.checkIn));
            const co = toDateStr(new Date(b.checkOut));
            return dayStr >= ci && dayStr < co;
        });
    };

    const handleCellClick = (room, day, booking) => {
        if (booking && onCheckOut) {
            onCheckOut(room, booking);
        } else if (!booking && onCheckIn) {
            onCheckIn(room, day);
        }
    };

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
                    <IconButton onClick={() => { const d = new Date(); d.setHours(0, 0, 0, 0); setWeekStart(d); }} size="small">
                        <TodayIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Chip label={`${calendarData.length} rooms`} size="small" variant="outlined" />
            </Stack>

            <Paper variant="outlined" sx={{ overflow: 'auto' }}>
                <Box sx={{ minWidth: 720 }}>
                    {/* Header */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '100px repeat(7, 1fr)', borderBottom: '2px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                        <Box sx={{ p: 1 }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">ROOM</Typography>
                        </Box>
                        {weekDays.map((d, i) => (
                            <Box key={i} sx={{ p: 1, textAlign: 'center', borderLeft: '1px solid', borderColor: 'divider', bgcolor: isToday(d) ? '#e3f2fd' : undefined }}>
                                <Typography variant="caption" fontWeight={700} color={isToday(d) ? 'primary' : 'text.secondary'}>
                                    {d.toLocaleDateString('en-AU', { weekday: 'short' })}
                                </Typography>
                                <Typography variant="caption" display="block" color={isToday(d) ? 'primary' : 'text.secondary'}>
                                    {d.getDate()}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Room rows */}
                    {calendarData.length === 0 && (
                        <Box py={4} textAlign="center">
                            <Typography color="text.secondary">No rooms found. Seed rooms first.</Typography>
                        </Box>
                    )}
                    {calendarData.map((room, ri) => (
                        <Box
                            key={room._id}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '100px repeat(7, 1fr)',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                '&:last-child': { borderBottom: 0 },
                            }}
                        >
                            {/* Room label */}
                            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: ri % 2 ? 'grey.50' : undefined }}>
                                <Typography variant="body2" fontWeight={700}>{room.roomNumber}</Typography>
                                <Typography variant="caption" color="text.secondary">{room.type}</Typography>
                            </Box>

                            {/* Day cells */}
                            {weekDays.map((day, di) => {
                                const booking = getBookingForCell(room, day);
                                const isCheckIn = booking && toDateStr(new Date(booking.checkIn)) === toDateStr(day);
                                const isCheckOut = booking && toDateStr(new Date(booking.checkOut)) === toDateStr(addDays(day, 1));

                                return (
                                    <Tooltip
                                        key={di}
                                        title={booking
                                            ? `${booking.guestName} — click to check out`
                                            : 'Click to check in'}
                                    >
                                        <Box
                                            onClick={() => handleCellClick(room, day, booking)}
                                            sx={{
                                                height: 48,
                                                borderLeft: '1px solid',
                                                borderColor: 'divider',
                                                bgcolor: booking
                                                    ? '#ffcdd2'
                                                    : isToday(day) ? '#f5fbff'
                                                        : STATUS_COLORS[room.status] || undefined,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                px: 0.5,
                                                overflow: 'hidden',
                                                borderRadius: isCheckIn ? '4px 0 0 4px' : isCheckOut ? '0 4px 4px 0' : undefined,
                                                transition: 'filter 0.15s',
                                                '&:hover': { filter: 'brightness(0.93)' },
                                            }}
                                        >
                                            {booking && isCheckIn && (
                                                <Typography variant="caption" fontWeight={600} noWrap sx={{ color: '#c62828', fontSize: '0.7rem' }}>
                                                    {booking.guestName}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Tooltip>
                                );
                            })}
                        </Box>
                    ))}
                </Box>
            </Paper>

            {/* Legend */}
            <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                <Chip size="small" label="Occupied" sx={{ bgcolor: '#ffcdd2' }} />
                <Chip size="small" label="Available" sx={{ bgcolor: '#e8f5e9' }} />
                <Chip size="small" label="Dirty" sx={{ bgcolor: '#fff8e1' }} />
                <Chip size="small" label="Maintenance" sx={{ bgcolor: '#fce4ec' }} />
                <Typography variant="caption" color="text.secondary" alignSelf="center">
                    Click occupied cell → Check out · Click empty → Check in
                </Typography>
            </Stack>
        </Box>
    );
}
