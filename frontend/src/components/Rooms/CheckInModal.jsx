import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Stack, Alert, CircularProgress, Typography,
} from '@mui/material';
import { bookingsApi } from '../../utils/pmsApi';

export default function CheckInModal({ room, onClose }) {
    const [form, setForm] = useState({ guestName: '', guestPhone: '', checkOut: '', notes: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const today = new Date().toISOString().split('T')[0];

    const handleSave = async () => {
        if (!form.guestName.trim()) { setError('Guest name is required'); return; }
        if (!form.checkOut) { setError('Check-out date is required'); return; }
        setSaving(true);
        setError(null);
        try {
            await bookingsApi.checkIn({
                roomId: room._id,
                guestName: form.guestName,
                guestPhone: form.guestPhone,
                checkIn: today,
                checkOut: form.checkOut,
                notes: form.notes,
            });
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Check In — Room {room.roomNumber}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Typography variant="body2" color="text.secondary">
                        {room.type} room, Floor {room.floor}
                    </Typography>
                    <TextField
                        label="Guest Name *"
                        value={form.guestName}
                        onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))}
                        fullWidth autoFocus
                    />
                    <TextField
                        label="Guest Phone"
                        value={form.guestPhone}
                        onChange={e => setForm(f => ({ ...f, guestPhone: e.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Check-In Date"
                        type="date"
                        value={today}
                        disabled
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Check-Out Date *"
                        type="date"
                        value={form.checkOut}
                        onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
                        inputProps={{ min: today }}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Notes"
                        multiline rows={2}
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button variant="contained" color="success" onClick={handleSave} disabled={saving}>
                    {saving ? <CircularProgress size={20} /> : 'Confirm Check-In'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
