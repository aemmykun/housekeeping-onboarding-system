import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Chip,
    LinearProgress,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    School,
    Timer,
    CheckCircle,
    PlayArrow,
    TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ModuleList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(null);

    // Filters
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [search, setSearch] = useState('');

    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'Room Cleaning', label: 'Room Cleaning' },
        { value: 'Bathroom Sanitation', label: 'Bathroom Sanitation' },
        { value: 'Laundry', label: 'Laundry' },
        { value: 'Safety', label: 'Safety' },
        { value: 'Customer Service', label: 'Customer Service' },
    ];

    const difficulties = [
        { value: '', label: 'All Levels' },
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
    ];

    useEffect(() => {
        fetchModules();
        if (user) {
            fetchProgress();
        }
    }, [category, difficulty, search, user]);

    const fetchModules = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (difficulty) params.append('difficulty', difficulty);
            if (search) params.append('search', search);

            const response = await axios.get(`${API_URL}/modules?${params.toString()}`);
            setModules(response.data.modules);
            setError('');
        } catch (err) {
            console.error('Fetch modules error:', err);
            setError('Failed to load modules');
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get(`${API_URL}/modules/user/progress`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProgress(response.data.progress);
        } catch (err) {
            console.error('Fetch progress error:', err);
        }
    };

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'beginner':
                return 'success';
            case 'intermediate':
                return 'warning';
            case 'advanced':
                return 'error';
            default:
                return 'default';
        }
    };

    const isModuleCompleted = (moduleId) => {
        if (!progress || !progress.completedList) return false;
        return progress.completedList.some(
            (cm) => cm.module._id === moduleId || cm.module === moduleId
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    📚 Learning Modules
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Explore our comprehensive training modules
                </Typography>
            </Box>

            {/* Progress Overview */}
            {user && progress && (
                <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <CardContent>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                                    Your Progress
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress.progressPercentage}
                                        sx={{
                                            flex: 1,
                                            height: 10,
                                            borderRadius: 5,
                                            bgcolor: 'rgba(255,255,255,0.3)',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: 'white',
                                            },
                                        }}
                                    />
                                    <Typography variant="h6" sx={{ color: 'white' }}>
                                        {progress.progressPercentage}%
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                    {progress.completedModules} of {progress.totalModules} modules completed
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                                        Level {progress.level}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                        {progress.points} points
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search modules..."
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                select
                                fullWidth
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                select
                                fullWidth
                                label="Difficulty"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                {difficulties.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Loading */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={60} />
                </Box>
            ) : (
                <>
                    {/* Module Grid */}
                    <Grid container spacing={3}>
                        {modules.map((module) => {
                            const completed = isModuleCompleted(module._id);

                            return (
                                <Grid item xs={12} md={6} lg={4} key={module._id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4,
                                            },
                                        }}
                                    >
                                        {completed && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 16,
                                                    right: 16,
                                                    zIndex: 1,
                                                }}
                                            >
                                                <CheckCircle sx={{ color: 'success.main', fontSize: 32 }} />
                                            </Box>
                                        )}

                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ mb: 2 }}>
                                                <Chip
                                                    label={module.category}
                                                    size="small"
                                                    sx={{ mr: 1, mb: 1 }}
                                                />
                                                <Chip
                                                    label={module.difficulty}
                                                    size="small"
                                                    color={getDifficultyColor(module.difficulty)}
                                                    sx={{ mb: 1 }}
                                                />
                                            </Box>

                                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                                {module.title}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 2 }}
                                            >
                                                {module.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Timer fontSize="small" color="action" />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {module.estimatedTime} min
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <TrendingUp fontSize="small" color="action" />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {module.points} points
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>

                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            <Button
                                                fullWidth
                                                variant={completed ? 'outlined' : 'contained'}
                                                startIcon={completed ? <School /> : <PlayArrow />}
                                                onClick={() => navigate(`/modules/${module._id}`)}
                                            >
                                                {completed ? 'Review' : 'Start Module'}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* No Results */}
                    {modules.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No modules found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Try adjusting your filters
                            </Typography>
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default ModuleList;
