import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, FormControl, InputLabel, Select, MenuItem,
    TextField, Stack, Typography, Alert, CircularProgress,
} from '@mui/material';
import { roomsApi } from '../../utils/pmsApi';

const STATUSES = [
    { value: 'available', label: '🟢 Available' },
    { value: 'occupied', label: '🔴 Occupied' },
    { value: 'dirty', label: '🟠 Dirty' },
    { value: 'cleaning', label: '🔵 Cleaning' },
    { value: 'clean', label: '🟡 Clean' },
    { value: 'maintenance', label: '⚫ Maintenance' },
    { value: 'dnd', label: '🟣 Do Not Disturb' },
];

export default function RoomStatusModal({ room, onClose }) {
    const [status, setStatus] = useState(room.status);
    const [note, setNote] = useState(room.notes || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await roomsApi.updateStatus(room._id, status);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Room {room.roomNumber} — Update Status</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Typography variant="body2" color="text.secondary">
                        Current status: <strong>{room.status}</strong>
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>New Status</InputLabel>
                        <Select value={status} label="New Status" onChange={e => setStatus(e.target.value)}>
                            {STATUSES.map(s => (
                                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Note (optional)"
                        multiline
                        rows={2}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={saving}>
                    {saving ? <CircularProgress size={20} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
