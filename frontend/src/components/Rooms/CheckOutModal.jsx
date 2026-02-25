import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Alert, CircularProgress, Stack, Box,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { bookingsApi } from '../../utils/pmsApi';

export default function CheckOutModal({ room, onClose }) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const booking = room.currentBookingId;

    const handleCheckOut = async () => {
        if (!booking?._id) { setError('No active booking found for this room'); return; }
        setSaving(true);
        setError(null);
        try {
            await bookingsApi.checkOut(booking._id);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Check Out — Room {room.roomNumber}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {booking ? (
                        <>
                            <Box sx={{ bgcolor: 'grey.100', borderRadius: 1, p: 2 }}>
                                <Typography variant="body1" fontWeight={600}>{booking.guestName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Alert severity="info" icon={<LogoutIcon />}>
                                Checking out will mark the room as <strong>Dirty</strong> and automatically create a clean task.
                            </Alert>
                        </>
                    ) : (
                        <Alert severity="warning">No booking data found for this room.</Alert>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button
                    variant="contained"
                    color="warning"
                    onClick={handleCheckOut}
                    disabled={saving || !booking}
                    startIcon={saving ? <CircularProgress size={18} /> : <LogoutIcon />}
                >
                    Confirm Check-Out
                </Button>
            </DialogActions>
        </Dialog>
    );
}
