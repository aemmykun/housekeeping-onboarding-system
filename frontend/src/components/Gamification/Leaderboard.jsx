import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import { EmojiEvents, Stars } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Leaderboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/leaderboard`);
                setLeaderboard(response.data.leaderboard);
                setError(null);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                setError('Failed to load leaderboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    const getRankIcon = (rank) => {
        if (rank === 0) return <EmojiEvents sx={{ color: '#FFD700' }} />; // Gold
        if (rank === 1) return <EmojiEvents sx={{ color: '#C0C0C0' }} />; // Silver
        if (rank === 2) return <EmojiEvents sx={{ color: '#CD7F32' }} />; // Bronze
        return null;
    };

    return (
        <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
            <Box sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmojiEvents fontSize="large" />
                    <Typography variant="h5" fontWeight="bold">
                        Top Performers
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    See who's leading the way in Housekeeping excellence
                </Typography>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Trainee</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Level</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboard.length > 0 ? (
                            leaderboard.map((user, index) => (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        bgcolor: index < 3 ? 'rgba(102, 126, 234, 0.03)' : 'inherit'
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getRankIcon(index)}
                                            <Typography fontWeight={index < 3 ? 'bold' : 'normal'}>
                                                #{index + 1}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                src={user.profileImage}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                sx={{ width: 32, height: 32 }}
                                            />
                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {user.firstName} {user.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {user.department}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            icon={<Stars fontSize="small" />}
                                            label={`Lv ${user.level}`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight="bold" color="primary.main">
                                            {user.points.toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    No data available yet. Start training to see your name here!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default Leaderboard;
