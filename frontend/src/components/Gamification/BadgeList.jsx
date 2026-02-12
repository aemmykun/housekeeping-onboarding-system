import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Grid,
    Box,
    Tooltip,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Shield } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const BadgeList = ({ earnedBadges = [] }) => {
    const [loading, setLoading] = useState(true);
    const [allBadges, setAllBadges] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/leaderboard/badges`);
                setAllBadges(response.data.badges);
            } catch (err) {
                console.error('Error fetching badges:', err);
                setError('Failed to load badges.');
            } finally {
                setLoading(false);
            }
        };

        fetchBadges();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    // Map through all badges to see which ones are earned
    const badgesToDisplay = allBadges.map(badge => ({
        ...badge,
        earned: earnedBadges.some(eb => (eb._id || eb) === badge._id)
    }));

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Shield color="primary" />
                <Typography variant="h6" fontWeight="bold">
                    Achievements & Badges
                </Typography>
            </Box>

            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2}>
                {badgesToDisplay.length > 0 ? (
                    badgesToDisplay.map((badge) => (
                        <Grid item xs={4} sm={3} md={2} key={badge._id} sx={{ textAlign: 'center' }}>
                            <Tooltip title={`${badge.name}: ${badge.description}`}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        filter: badge.earned ? 'none' : 'grayscale(1) opacity(0.4)',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'scale(1.1)' }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            fontSize: '2rem',
                                            bgcolor: 'background.default',
                                            borderRadius: '50%',
                                            width: 60,
                                            height: 60,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: 2,
                                            borderColor: badge.earned ? 'primary.main' : 'divider',
                                            boxShadow: badge.earned ? 3 : 0
                                        }}
                                    >
                                        {badge.icon}
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        display="block"
                                        sx={{
                                            mt: 1,
                                            fontWeight: badge.earned ? 'bold' : 'normal',
                                            lineHeight: 1.2,
                                            maxWidth: 60,
                                            mx: 'auto'
                                        }}
                                    >
                                        {badge.name}
                                    </Typography>
                                </Box>
                            </Tooltip>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" align="center">
                            No badges available yet.
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

export default BadgeList;
