import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    MenuItem,
    IconButton,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Add,
    Delete,
    Save,
    ArrowBack,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ModuleEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Room Cleaning',
        difficulty: 'beginner',
        estimatedTime: 30,
        content: '',
        videoUrl: '',
        points: 10,
        order: 0,
        isPublished: true,
        resources: [],
        quiz: {
            passingScore: 70,
            questions: [],
        },
    });

    useEffect(() => {
        const fetchModule = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/modules/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData(response.data.module);
            } catch (err) {
                console.error('Fetch module error:', err);
                setError('Failed to load module');
            } finally {
                setLoading(false);
            }
        };

        if (isEditMode) {
            fetchModule();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleQuizChange = (field, value) => {
        setFormData({
            ...formData,
            quiz: { ...formData.quiz, [field]: value },
        });
    };

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            quiz: {
                ...formData.quiz,
                questions: [
                    ...formData.quiz.questions,
                    {
                        question: '',
                        options: ['', '', '', ''],
                        correctAnswer: '',
                        explanation: '',
                    },
                ],
            },
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const questions = [...formData.quiz.questions];
        questions[index] = { ...questions[index], [field]: value };
        setFormData({
            ...formData,
            quiz: { ...formData.quiz, questions },
        });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const questions = [...formData.quiz.questions];
        questions[qIndex].options[oIndex] = value;
        setFormData({
            ...formData,
            quiz: { ...formData.quiz, questions },
        });
    };

    const handleRemoveQuestion = (index) => {
        const questions = formData.quiz.questions.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            quiz: { ...formData.quiz, questions },
        });
    };

    const handleAddResource = () => {
        setFormData({
            ...formData,
            resources: [
                ...formData.resources,
                { title: '', url: '', description: '' },
            ],
        });
    };

    const handleResourceChange = (index, field, value) => {
        const resources = [...formData.resources];
        resources[index] = { ...resources[index], [field]: value };
        setFormData({ ...formData, resources });
    };

    const handleRemoveResource = (index) => {
        const resources = formData.resources.filter((_, i) => i !== index);
        setFormData({ ...formData, resources });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            setSaving(true);
            const token = localStorage.getItem('token');

            if (isEditMode) {
                await axios.put(`${API_URL}/modules/${id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess('Module updated successfully!');
            } else {
                await axios.post(`${API_URL}/modules`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess('Module created successfully!');
            }

            setTimeout(() => navigate('/modules'), 2000);
        } catch (err) {
            console.error('Save module error:', err);
            setError(err.response?.data?.message || 'Failed to save module');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/modules')}
                sx={{ mb: 2 }}
            >
                Back to Modules
            </Button>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                {isEditMode ? 'Edit Module' : 'Create New Module'}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Basic Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                required
                                fullWidth
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <MenuItem value="Room Cleaning">Room Cleaning</MenuItem>
                                <MenuItem value="Bathroom Sanitation">Bathroom Sanitation</MenuItem>
                                <MenuItem value="Laundry">Laundry</MenuItem>
                                <MenuItem value="Safety">Safety</MenuItem>
                                <MenuItem value="Customer Service">Customer Service</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                required
                                fullWidth
                                label="Difficulty"
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                            >
                                <MenuItem value="beginner">Beginner</MenuItem>
                                <MenuItem value="intermediate">Intermediate</MenuItem>
                                <MenuItem value="advanced">Advanced</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="Estimated Time (minutes)"
                                name="estimatedTime"
                                value={formData.estimatedTime}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="Points"
                                name="points"
                                value={formData.points}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Order"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Video URL (YouTube, Vimeo, etc.)"
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleChange}
                                placeholder="https://www.youtube.com/embed/..."
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Content */}
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Content
                    </Typography>
                    <TextField
                        required
                        fullWidth
                        multiline
                        rows={15}
                        label="Module Content (HTML supported)"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        helperText="You can use HTML tags for formatting"
                    />
                </Paper>

                {/* Resources */}
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Resources
                        </Typography>
                        <Button startIcon={<Add />} onClick={handleAddResource}>
                            Add Resource
                        </Button>
                    </Box>
                    {formData.resources.map((resource, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        value={resource.title}
                                        onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        fullWidth
                                        label="URL"
                                        value={resource.url}
                                        onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <IconButton color="error" onClick={() => handleRemoveResource(index)}>
                                        <Delete />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={resource.description}
                                        onChange={(e) => handleResourceChange(index, 'description', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </Paper>

                {/* Quiz */}
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Quiz
                        </Typography>
                        <Button startIcon={<Add />} onClick={handleAddQuestion}>
                            Add Question
                        </Button>
                    </Box>
                    <TextField
                        fullWidth
                        type="number"
                        label="Passing Score (%)"
                        value={formData.quiz.passingScore}
                        onChange={(e) => handleQuizChange('passingScore', e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    {formData.quiz.questions.map((question, qIndex) => (
                        <Box key={qIndex} sx={{ mb: 3, p: 2, border: 2, borderColor: 'primary.main', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Question {qIndex + 1}
                                </Typography>
                                <IconButton color="error" onClick={() => handleRemoveQuestion(qIndex)}>
                                    <Delete />
                                </IconButton>
                            </Box>
                            <TextField
                                fullWidth
                                label="Question"
                                value={question.question}
                                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="body2" gutterBottom>
                                Options:
                            </Typography>
                            {question.options.map((option, oIndex) => (
                                <TextField
                                    key={oIndex}
                                    fullWidth
                                    label={`Option ${oIndex + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    sx={{ mb: 1 }}
                                />
                            ))}
                            <TextField
                                fullWidth
                                label="Correct Answer"
                                value={question.correctAnswer}
                                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                                sx={{ mb: 1 }}
                                helperText="Enter the exact text of the correct option"
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Explanation (optional)"
                                value={question.explanation}
                                onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                            />
                        </Box>
                    ))}
                </Paper>

                {/* Submit */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => navigate('/modules')}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : isEditMode ? 'Update Module' : 'Create Module'}
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default ModuleEditor;
