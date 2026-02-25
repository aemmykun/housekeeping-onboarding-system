import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, Typography, Chip, CircularProgress, Alert,
    Button, Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { roomsApi } from '../../utils/pmsApi';
import RoomCard from './RoomCard';
import RoomStatusModal from './RoomStatusModal';
import CheckInModal from './CheckInModal';
import CheckOutModal from './CheckOutModal';

const POLL_INTERVAL = 10000; // 10 seconds

const STATUS_LABELS = {
    available: 'Available',
    occupied: 'Occupied',
    dirty: 'Dirty',
    cleaning: 'Cleaning',
    clean: 'Clean',
    maintenance: 'Maintenance',
    dnd: 'Do Not Disturb',
};

const STATUS_COLORS = {
    available: '#4caf50',
    occupied: '#f44336',
    dirty: '#ff9800',
    cleaning: '#2196f3',
    clean: '#8bc34a',
    maintenance: '#9e9e9e',
    dnd: '#9c27b0',
};

export { STATUS_COLORS, STATUS_LABELS };

export default function RoomGrid({ userRole }) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [modal, setModal] = useState(null); // 'status' | 'checkin' | 'checkout'
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchRooms = useCallback(async () => {
        try {
            const data = await roomsApi.getAll();
            setRooms(data.rooms);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => { fetchRooms(); }, [fetchRooms]);

    // Polling every 10 seconds
    useEffect(() => {
        const interval = setInterval(fetchRooms, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchRooms]);

    const openModal = (room, type) => {
        setSelectedRoom(room);
        setModal(type);
    };

    const closeModal = () => {
        setSelectedRoom(null);
        setModal(null);
        fetchRooms(); // refresh after any change
    };

    const groupedByFloor = rooms
        .filter(r => filterStatus === 'all' || r.status === filterStatus)
        .reduce((acc, room) => {
            const floor = room.floor;
            if (!acc[floor]) acc[floor] = [];
            acc[floor].push(room);
            return acc;
        }, {});

    if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;

    return (
        <Box>
            {/* Filter Bar */}
            <Box display="flex" alignItems="center" gap={1} mb={3} flexWrap="wrap">
                <Chip
                    label="All"
                    onClick={() => setFilterStatus('all')}
                    color={filterStatus === 'all' ? 'primary' : 'default'}
                    variant={filterStatus === 'all' ? 'filled' : 'outlined'}
                />
                {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <Chip
                        key={status}
                        label={label}
                        onClick={() => setFilterStatus(status)}
                        variant={filterStatus === status ? 'filled' : 'outlined'}
                        sx={{
                            borderColor: STATUS_COLORS[status],
                            color: filterStatus === status ? 'white' : STATUS_COLORS[status],
                            bgcolor: filterStatus === status ? STATUS_COLORS[status] : 'transparent',
                        }}
                    />
                ))}
                <Tooltip title="Refresh now">
                    <Button size="small" startIcon={<RefreshIcon />} onClick={fetchRooms} sx={{ ml: 'auto' }}>
                        Refresh
                    </Button>
                </Tooltip>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Floors */}
            {Object.keys(groupedByFloor).sort().map((floor) => (
                <Box key={floor} mb={4}>
                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary" mb={1}>
                        Floor {floor}
                    </Typography>
                    <Grid container spacing={2}>
                        {groupedByFloor[floor].map((room) => (
                            <Grid item xs={6} sm={4} md={3} lg={2} key={room._id}>
                                <RoomCard
                                    room={room}
                                    userRole={userRole}
                                    onStatusClick={() => openModal(room, 'status')}
                                    onCheckIn={() => openModal(room, 'checkin')}
                                    onCheckOut={() => openModal(room, 'checkout')}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ))}

            {rooms.length === 0 && !error && (
                <Box textAlign="center" py={8}>
                    <Typography color="text.secondary" mb={2}>No rooms yet.</Typography>
                    {userRole === 'manager' && (
                        <Button variant="contained" onClick={() => roomsApi.seed().then(fetchRooms)}>
                            Seed Sample Rooms
                        </Button>
                    )}
                </Box>
            )}

            {/* Modals */}
            {modal === 'status' && selectedRoom && (
                <RoomStatusModal room={selectedRoom} onClose={closeModal} />
            )}
            {modal === 'checkin' && selectedRoom && (
                <CheckInModal room={selectedRoom} onClose={closeModal} />
            )}
            {modal === 'checkout' && selectedRoom && (
                <CheckOutModal room={selectedRoom} onClose={closeModal} />
            )}
        </Box>
    );
}
