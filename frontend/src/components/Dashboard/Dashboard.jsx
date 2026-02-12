import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    School,
    EmojiEvents,
    TrendingUp,
    Logout,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../Gamification/Leaderboard';
import BadgeList from '../Gamification/BadgeList';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const stats = [
        {
            title: 'Modules Completed',
            value: user?.completedModules?.length || 0,
            icon: <School sx={{ fontSize: 40 }} />,
            color: '#4caf50',
        },
        {
            title: 'Total Points',
            value: user?.points || 0,
            icon: <EmojiEvents sx={{ fontSize: 40 }} />,
            color: '#ff9800',
        },
        {
            title: 'Current Level',
            value: user?.level || 1,
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            color: '#2196f3',
        },
        {
            title: 'Badges Earned',
            value: user?.badges?.length || 0,
            icon: <EmojiEvents sx={{ fontSize: 40 }} />,
            color: '#9c27b0',
        },
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                {/* Header */}
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    bgcolor: 'primary.main',
                                    fontSize: 28,
                                }}
                            >
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight="bold">
                                    Welcome back, {user?.firstName}!
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip label={user?.role} color="primary" size="small" />
                                    <Chip label={user?.department} variant="outlined" size="small" />
                                </Box>
                            </Box>
                        </Box>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Logout />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                </Paper>

                {/* Stats Grid */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {stat.title}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Main Content */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        {/* Learning Journey Card */}
                        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <DashboardIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h5" fontWeight="bold">
                                    Your Learning Journey
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Welcome to your personalized dashboard! Here you can track your progress,
                                access learning modules, and view your achievements.
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{ mr: 2 }}
                                    onClick={() => navigate('/modules')}
                                >
                                    Continue Learning
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/modules')}
                                >
                                    View All Modules
                                </Button>
                            </Box>
                        </Paper>

                        {/* Badges Section */}
                        <BadgeList earnedBadges={user?.badges || []} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        {/* Leaderboard Card */}
                        <Box sx={{ mb: 3 }}>
                            <Leaderboard />
                        </Box>

                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Profile Information
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Email
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {user?.email}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Department
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {user?.department}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Role
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {user?.role}
                                </Typography>

                                <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                                    Edit Profile
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard;
