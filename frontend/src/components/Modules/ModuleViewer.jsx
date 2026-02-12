import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    ArrowBack,
    CheckCircle,
    Timer,
    TrendingUp,
    PlayCircle,
    Description,
    Quiz as QuizIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Quiz from './Quiz';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ModuleViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [module, setModule] = useState(null);
    const [userProgress, setUserProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showQuiz, setShowQuiz] = useState(false);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        fetchModule();
    }, [id]);

    const fetchModule = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get(`${API_URL}/modules/${id}`, { headers });
            setModule(response.data.module);
            setUserProgress(response.data.userProgress);
            setError('');
        } catch (err) {
            console.error('Fetch module error:', err);
            setError('Failed to load module');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteModule = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            setCompleting(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/modules/${id}/complete`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(`Module completed! You earned ${response.data.pointsEarned} points!`);
            fetchModule(); // Refresh to show completion status
        } catch (err) {
            console.error('Complete module error:', err);
            alert(err.response?.data?.message || 'Failed to complete module');
        } finally {
            setCompleting(false);
        }
    };

    const handleStartQuiz = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setShowQuiz(true);
    };

    const handleQuizComplete = () => {
        setShowQuiz(false);
        fetchModule(); // Refresh to show completion status
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

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error || !module) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error || 'Module not found'}</Alert>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/modules')} sx={{ mt: 2 }}>
                    Back to Modules
                </Button>
            </Container>
        );
    }

    if (showQuiz) {
        return (
            <Quiz
                moduleId={id}
                module={module}
                onComplete={handleQuizComplete}
                onCancel={() => setShowQuiz(false)}
            />
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/modules')}
                sx={{ mb: 2 }}
            >
                Back to Modules
            </Button>

            {/* Module Header */}
            <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <Chip label={module.category} sx={{ mr: 1, mb: 1 }} />
                    <Chip
                        label={module.difficulty}
                        color={getDifficultyColor(module.difficulty)}
                        sx={{ mr: 1, mb: 1 }}
                    />
                    {userProgress?.completed && (
                        <Chip
                            icon={<CheckCircle />}
                            label="Completed"
                            color="success"
                            sx={{ mb: 1 }}
                        />
                    )}
                </Box>

                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {module.title}
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                    {module.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timer color="action" />
                        <Typography variant="body2">
                            <strong>{module.estimatedTime}</strong> minutes
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp color="action" />
                        <Typography variant="body2">
                            <strong>{module.points}</strong> points
                        </Typography>
                    </Box>
                    {userProgress?.completed && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle color="success" />
                            <Typography variant="body2">
                                Score: <strong>{userProgress.score}%</strong>
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Video (if available) */}
            {module.videoUrl && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <PlayCircle color="primary" />
                        <Typography variant="h6" fontWeight="bold">
                            Video Tutorial
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            position: 'relative',
                            paddingBottom: '56.25%', // 16:9 aspect ratio
                            height: 0,
                            overflow: 'hidden',
                        }}
                    >
                        <iframe
                            src={module.videoUrl}
                            title={module.title}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                borderRadius: '8px',
                            }}
                            allowFullScreen
                        />
                    </Box>
                </Paper>
            )}

            {/* Content */}
            <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Description color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                        Module Content
                    </Typography>
                </Box>

                <Box
                    sx={{
                        '& h1, & h2, & h3': { mt: 3, mb: 2, fontWeight: 'bold' },
                        '& p': { mb: 2, lineHeight: 1.7 },
                        '& ul, & ol': { mb: 2, pl: 3 },
                        '& li': { mb: 1 },
                        '& img': { maxWidth: '100%', borderRadius: 2, my: 2 },
                    }}
                    dangerouslySetInnerHTML={{ __html: module.content }}
                />
            </Paper>

            {/* Resources */}
            {module.resources && module.resources.length > 0 && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        📎 Additional Resources
                    </Typography>
                    <List>
                        {module.resources.map((resource, index) => (
                            <ListItem
                                key={index}
                                button
                                component="a"
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ListItemIcon>
                                    <Description />
                                </ListItemIcon>
                                <ListItemText
                                    primary={resource.title}
                                    secondary={resource.description}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            {/* Quiz/Complete Section */}
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                {module.quiz && module.quiz.questions && module.quiz.questions.length > 0 ? (
                    <>
                        <QuizIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Ready to test your knowledge?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Complete the quiz to earn {module.points} points
                            {userProgress?.completed && ' and improve your score'}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleStartQuiz}
                            startIcon={<QuizIcon />}
                        >
                            {userProgress?.completed ? 'Retake Quiz' : 'Start Quiz'}
                        </Button>
                    </>
                ) : (
                    <>
                        <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Mark this module as complete
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Earn {module.points} points by completing this module
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleCompleteModule}
                            disabled={completing || userProgress?.completed}
                            startIcon={completing ? <CircularProgress size={20} /> : <CheckCircle />}
                        >
                            {userProgress?.completed ? 'Already Completed' : 'Complete Module'}
                        </Button>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default ModuleViewer;
