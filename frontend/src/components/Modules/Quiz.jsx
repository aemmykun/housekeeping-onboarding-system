import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    LinearProgress,
    Alert,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    EmojiEvents,
    ArrowBack,
    ArrowForward,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Quiz = ({ moduleId, module, onComplete, onCancel }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const questions = module.quiz?.questions || [];
    const totalQuestions = questions.length;
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({
            ...answers,
            [questionId]: answer,
        });
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        // Check if all questions are answered
        const unanswered = questions.filter((q) => !answers[q._id]);
        if (unanswered.length > 0) {
            alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Format answers for API
            const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
                questionId,
                selectedAnswer,
            }));

            const response = await axios.post(
                `${API_URL}/modules/${moduleId}/quiz`,
                { answers: formattedAnswers },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setResults(response.data);
            setSubmitted(true);
        } catch (err) {
            console.error('Submit quiz error:', err);
            alert(err.response?.data?.message || 'Failed to submit quiz');
        } finally {
            setLoading(false);
        }
    };

    if (submitted && results) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                {/* Results Header */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mb: 3,
                        textAlign: 'center',
                        background: results.passed
                            ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
                            : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                        color: 'white',
                    }}
                >
                    {results.passed ? (
                        <EmojiEvents sx={{ fontSize: 64, mb: 2 }} />
                    ) : (
                        <Cancel sx={{ fontSize: 64, mb: 2 }} />
                    )}
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {results.passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Your Score: {results.score}%
                    </Typography>
                    <Typography variant="body1">
                        {results.correctAnswers} out of {results.totalQuestions} correct
                    </Typography>
                    {results.passed && results.pointsEarned > 0 && (
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            +{results.pointsEarned} Points Earned!
                        </Typography>
                    )}
                </Paper>

                {/* Answer Review */}
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                    Review Your Answers
                </Typography>

                {results.results.map((result, index) => (
                    <Card
                        key={index}
                        sx={{
                            mb: 2,
                            border: 2,
                            borderColor: result.isCorrect ? 'success.main' : 'error.main',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                {result.isCorrect ? (
                                    <CheckCircle color="success" />
                                ) : (
                                    <Cancel color="error" />
                                )}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Question {index + 1}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {result.question}
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Your Answer:
                                        </Typography>
                                        <Chip
                                            label={result.userAnswer || 'Not answered'}
                                            color={result.isCorrect ? 'success' : 'error'}
                                            sx={{ mr: 1 }}
                                        />
                                    </Box>

                                    {!result.isCorrect && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Correct Answer:
                                            </Typography>
                                            <Chip label={result.correctAnswer} color="success" />
                                        </Box>
                                    )}

                                    {result.explanation && (
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            <Typography variant="body2">
                                                <strong>Explanation:</strong> {result.explanation}
                                            </Typography>
                                        </Alert>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                    {!results.passed && (
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => {
                                setSubmitted(false);
                                setResults(null);
                                setAnswers({});
                                setCurrentQuestion(0);
                            }}
                        >
                            Retake Quiz
                        </Button>
                    )}
                    <Button
                        variant={results.passed ? 'contained' : 'outlined'}
                        size="large"
                        onClick={onComplete}
                    >
                        {results.passed ? 'Continue' : 'Back to Module'}
                    </Button>
                </Box>
            </Container>
        );
    }

    if (questions.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="warning">This module has no quiz questions.</Alert>
                <Button onClick={onCancel} sx={{ mt: 2 }}>
                    Back to Module
                </Button>
            </Container>
        );
    }

    const question = questions[currentQuestion];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {/* Progress */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Quiz: {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Question {currentQuestion + 1} of {totalQuestions}
                    </Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
            </Paper>

            {/* Question */}
            <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Question {currentQuestion + 1}
                </Typography>
                <Typography variant="h6" paragraph sx={{ mt: 2, mb: 3 }}>
                    {question.question}
                </Typography>

                <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                        value={answers[question._id] || ''}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    >
                        {question.options.map((option, index) => (
                            <Paper
                                key={index}
                                elevation={answers[question._id] === option ? 3 : 1}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    cursor: 'pointer',
                                    border: 2,
                                    borderColor:
                                        answers[question._id] === option ? 'primary.main' : 'transparent',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.light',
                                        boxShadow: 2,
                                    },
                                }}
                                onClick={() => handleAnswerChange(question._id, option)}
                            >
                                <FormControlLabel
                                    value={option}
                                    control={<Radio />}
                                    label={
                                        <Typography variant="body1" sx={{ ml: 1 }}>
                                            {option}
                                        </Typography>
                                    }
                                    sx={{ width: '100%', m: 0 }}
                                />
                            </Paper>
                        ))}
                    </RadioGroup>
                </FormControl>
            </Paper>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                    >
                        Previous
                    </Button>

                    {currentQuestion < totalQuestions - 1 ? (
                        <Button
                            variant="contained"
                            endIcon={<ArrowForward />}
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Quiz'}
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Answer Status */}
            <Paper elevation={1} sx={{ p: 2, mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress: {Object.keys(answers).length} of {totalQuestions} answered
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {questions.map((q, index) => (
                        <Chip
                            key={index}
                            label={index + 1}
                            size="small"
                            color={answers[q._id] ? 'primary' : 'default'}
                            onClick={() => setCurrentQuestion(index)}
                            sx={{ cursor: 'pointer' }}
                        />
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default Quiz;
