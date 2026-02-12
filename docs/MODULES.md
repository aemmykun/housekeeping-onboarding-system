# Learning Modules System Documentation

## 🎓 Overview

The Learning Modules System is a comprehensive feature that allows:

- **Trainees** to browse and complete training modules
- **Supervisors/Admins** to create and manage educational content
- **Automatic progress tracking** with points and levels
- **Interactive quizzes** with instant feedback

---

## 📁 Files Created

### Backend

- `backend/controllers/moduleController.js` - Module CRUD and quiz logic
- `backend/routes/modules.js` - API endpoints for modules
- `backend/seedModules.js` - Sample data seeder

### Frontend

- `frontend/src/components/Modules/ModuleList.jsx` - Browse modules with filters
- `frontend/src/components/Modules/ModuleViewer.jsx` - View module content
- `frontend/src/components/Modules/Quiz.jsx` - Interactive quiz interface
- `frontend/src/components/Modules/ModuleEditor.jsx` - Admin module creation/editing

---

## 🔌 API Endpoints

### Public Endpoints

```
GET /api/modules
  - Get all modules
  - Query params: category, difficulty, search
  - Returns: List of modules (without correct answers)

GET /api/modules/:id
  - Get single module by ID
  - Returns: Module details + user progress (if authenticated)
```

### Protected Endpoints (Require Authentication)

```
POST /api/modules/:id/quiz
  - Submit quiz answers
  - Body: { answers: [{ questionId, selectedAnswer }] }
  - Returns: Score, results, points earned

POST /api/modules/:id/complete
  - Mark module as complete (for modules without quiz)
  - Returns: Points earned, new level

GET /api/modules/user/progress
  - Get user's learning progress
  - Returns: Completed modules, progress percentage, points, level
```

### Admin/Supervisor Endpoints

```
POST /api/modules
  - Create new module
  - Requires: admin or supervisor role
  - Body: Module data (title, description, content, quiz, etc.)

PUT /api/modules/:id
  - Update existing module
  - Requires: admin or supervisor role
  - Body: Updated module data

DELETE /api/modules/:id
  - Delete module
  - Requires: admin role only
```

---

## 🎯 Features

### 1. Module Browsing

- **Filter by category**: Room Cleaning, Bathroom Sanitation, Laundry, Safety, Customer Service
- **Filter by difficulty**: Beginner, Intermediate, Advanced
- **Search**: Find modules by title or description
- **Progress tracking**: See which modules you've completed
- **Completion badges**: Visual indicators for completed modules

### 2. Module Content

- **Rich HTML content**: Formatted text, lists, headings
- **Video support**: Embed YouTube, Vimeo, or other video platforms
- **Resources**: Additional links and materials
- **Estimated time**: Know how long each module takes
- **Points system**: Earn points for completing modules

### 3. Interactive Quizzes

- **Multiple choice questions**: 4 options per question
- **Progress tracking**: See which questions you've answered
- **Navigation**: Move between questions freely
- **Instant feedback**: See correct/incorrect answers immediately
- **Explanations**: Learn why answers are correct/incorrect
- **Passing score**: Must achieve minimum score to earn points
- **Retake option**: Try again if you don't pass

### 4. Gamification

- **Points**: Earn points for completing modules and passing quizzes
- **Levels**: Automatically level up every 100 points
- **Progress tracking**: See your overall completion percentage
- **Achievements**: Visual feedback for accomplishments

### 5. Admin Module Editor

- **Full WYSIWYG**: Create rich content with HTML
- **Quiz builder**: Add multiple questions with options
- **Resource management**: Add helpful links and materials
- **Category organization**: Organize modules by topic
- **Difficulty levels**: Tag modules as beginner/intermediate/advanced
- **Publishing control**: Draft and publish modules

---

## 🚀 Getting Started

### 1. Seed the Database

First, ensure your MongoDB connection is working, then run:

```bash
npm run seed
```

This will create 5 sample modules:

1. Introduction to Room Cleaning (Beginner)
2. Bathroom Sanitation Standards (Intermediate)
3. Laundry Operations (Beginner)
4. Workplace Safety and Ergonomics (Beginner)
5. Guest Service Excellence (Intermediate)

### 2. Access the Modules

Navigate to: `http://localhost:3000/modules`

You can browse modules without logging in, but you must be authenticated to:

- Take quizzes
- Complete modules
- Track progress

### 3. Create Your Own Modules (Admin/Supervisor)

1. Log in as an admin or supervisor
2. Navigate to `/modules/new`
3. Fill in the module details:
   - Title and description
   - Category and difficulty
   - Estimated time and points
   - Content (HTML supported)
   - Video URL (optional)
   - Resources (optional)
   - Quiz questions

4. Click "Create Module"

---

## 📊 Module Structure

```javascript
{
  title: String,              // Module title
  description: String,        // Short description
  category: String,           // Category (Room Cleaning, etc.)
  difficulty: String,         // beginner | intermediate | advanced
  estimatedTime: Number,      // Minutes to complete
  points: Number,             // Points awarded
  order: Number,              // Display order
  content: String,            // HTML content
  videoUrl: String,           // Optional video embed URL
  resources: [{               // Optional additional resources
    title: String,
    url: String,
    description: String
  }],
  quiz: {
    passingScore: Number,     // Percentage required to pass
    questions: [{
      question: String,
      options: [String],      // 4 options
      correctAnswer: String,
      explanation: String     // Why this answer is correct
    }]
  },
  isPublished: Boolean,       // Whether module is visible
  createdBy: ObjectId         // User who created it
}
```

---

## 🎨 User Interface

### Module List Page

- **Grid layout**: Responsive cards showing all modules
- **Progress bar**: Visual representation of overall progress
- **Filter panel**: Category, difficulty, and search
- **Completion indicators**: Green checkmarks on completed modules
- **Quick stats**: Time, points, difficulty for each module

### Module Viewer Page

- **Header**: Title, category, difficulty, completion status
- **Video player**: Embedded video (if available)
- **Content**: Formatted HTML content
- **Resources**: Links to additional materials
- **Quiz/Complete button**: Start quiz or mark as complete

### Quiz Interface

- **Progress bar**: Shows current question number
- **Question navigation**: Jump to any question
- **Answer selection**: Click cards to select answers
- **Submit**: Review all answers before submitting
- **Results page**: Detailed feedback with explanations
- **Retake option**: Try again if you don't pass

### Module Editor (Admin)

- **Form sections**: Basic info, content, resources, quiz
- **Dynamic fields**: Add/remove questions and resources
- **Preview**: See how module will look
- **Save/Publish**: Draft or publish immediately

---

## 🔒 Permissions

| Action | Trainee | Mentor | Supervisor | Admin |
|--------|---------|--------|------------|-------|
| View modules | ✅ | ✅ | ✅ | ✅ |
| Take quizzes | ✅ | ✅ | ✅ | ✅ |
| Complete modules | ✅ | ✅ | ✅ | ✅ |
| Create modules | ❌ | ❌ | ✅ | ✅ |
| Edit modules | ❌ | ❌ | ✅ | ✅ |
| Delete modules | ❌ | ❌ | ❌ | ✅ |

---

## 📈 Progress Tracking

User progress is automatically tracked:

```javascript
// User model includes:
completedModules: [{
  module: ObjectId,
  completedAt: Date,
  score: Number
}],
points: Number,
level: Number
```

### Leveling System

- Level 1: 0-99 points
- Level 2: 100-199 points
- Level 3: 200-299 points
- And so on...

### Points Calculation

- **Pass quiz**: Full module points
- **Fail quiz**: 50% of module points
- **Complete module (no quiz)**: Full module points
- **Retake quiz**: Can improve score, but no additional points

---

## 🧪 Testing

### Test Module Viewing

```bash
curl http://localhost:5000/api/modules
```

### Test Quiz Submission

```bash
curl -X POST http://localhost:5000/api/modules/:id/quiz \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      { "questionId": "...", "selectedAnswer": "..." }
    ]
  }'
```

### Test Progress

```bash
curl http://localhost:5000/api/modules/user/progress \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Modules not loading

- Check MongoDB connection
- Verify modules exist in database
- Check browser console for errors

### Quiz not submitting

- Ensure all questions are answered
- Check authentication token
- Verify module has quiz questions

### Progress not updating

- Ensure user is authenticated
- Check backend logs for errors
- Verify module completion logic

### Seeder failing

- Verify MongoDB connection string in `.env`
- Check that Module model exists
- Ensure MongoDB is running

---

## 🎯 Next Steps

1. **Seed the database** with sample modules
2. **Test the module flow** as a trainee
3. **Create custom modules** as an admin
4. **Add more categories** as needed
5. **Customize points/levels** to your needs

---

## 📝 Sample Module Categories

Current categories:

- Room Cleaning
- Bathroom Sanitation
- Laundry
- Safety
- Customer Service

To add more categories, update:

1. Module model schema (if using enum)
2. ModuleEditor.jsx dropdown options
3. ModuleList.jsx filter options

---

## 🎉 Success

Your Learning Modules System is now complete! Users can:

- ✅ Browse and search modules
- ✅ Watch training videos
- ✅ Take interactive quizzes
- ✅ Track their progress
- ✅ Earn points and level up
- ✅ Review quiz results with explanations

Admins can:

- ✅ Create new modules
- ✅ Edit existing content
- ✅ Add quizzes with multiple questions
- ✅ Organize by category and difficulty
- ✅ Publish/unpublish modules

Happy learning! 🚀
