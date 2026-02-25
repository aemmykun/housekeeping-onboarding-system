import React from 'react';
import { Paper, Box, Typography, Chip, IconButton, Tooltip, Stack } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HotelIcon from '@mui/icons-material/Hotel';
import { STATUS_COLORS, STATUS_LABELS } from './RoomGrid';

const TYPE_ICONS = {
    single: '🛏',
    double: '🛏🛏',
    twin: '🛌🛌',
    suite: '🌟',
    deluxe: '✨',
};

export default function RoomCard({ room, userRole, onStatusClick, onCheckIn, onCheckOut }) {
    const color = STATUS_COLORS[room.status] || '#9e9e9e';
    const canCheckIn = room.status === 'available' && !room.outOfOrder;
    const canCheckOut = room.status === 'occupied';
    const canEdit = ['manager', 'front-desk'].includes(userRole);

    return (
        <Paper
            elevation={2}
            sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: `2px solid ${color}`,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
                opacity: room.outOfOrder ? 0.6 : 1,
            }}
        >
            {/* Colour header bar */}
            <Box sx={{ bgcolor: color, px: 1.5, py: 0.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} color="white">
                    {room.roomNumber}
                </Typography>
                <Typography variant="caption" color="white" sx={{ opacity: 0.85 }}>
                    {TYPE_ICONS[room.type] || '🛏'} {room.type}
                </Typography>
            </Box>

            {/* Body */}
            <Box px={1.5} py={1}>
                <Chip
                    label={STATUS_LABELS[room.status] || room.status}
                    size="small"
                    sx={{ bgcolor: color, color: 'white', fontWeight: 600, mb: 0.5, fontSize: '0.7rem' }}
                />

                {room.currentBookingId?.guestName && (
                    <Typography variant="caption" display="block" noWrap color="text.secondary">
                        <HotelIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                        {room.currentBookingId.guestName}
                    </Typography>
                )}

                {room.assignedStaff && (
                    <Typography variant="caption" display="block" noWrap color="text.secondary">
                        <EngineeringIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                        {room.assignedStaff.firstName} {room.assignedStaff.lastName}
                    </Typography>
                )}

                {room.outOfOrder && (
                    <Typography variant="caption" color="error" fontWeight={700}>OUT OF ORDER</Typography>
                )}

                {/* Actions */}
                {canEdit && (
                    <Stack direction="row" spacing={0.5} mt={0.5} justifyContent="flex-end">
                        {canCheckIn && (
                            <Tooltip title="Check In">
                                <IconButton size="small" color="success" onClick={onCheckIn}>
                                    <LoginIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canCheckOut && (
                            <Tooltip title="Check Out">
                                <IconButton size="small" color="warning" onClick={onCheckOut}>
                                    <LogoutIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Change Status">
                            <IconButton size="small" onClick={onStatusClick}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                )}
            </Box>
        </Paper>
    );
}
