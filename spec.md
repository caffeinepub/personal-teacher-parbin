# Personal Teacher: Parbin

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Home page with app branding "Personal Teacher: Parbin"
- Class selector (Class 1 to 12)
- Subject listing per class (Maths, Science, English, Hindi, Social Science, etc.)
- Lessons/Topics list per subject with video lecture placeholders
- Notes section with downloadable PDF placeholders
- Quiz & Test feature: multiple choice questions per subject/class
- Doubt solving: students can submit a question and get a sample answer
- Progress tracking: tracks which lessons/quizzes completed per student session
- AI Personal Teacher chat interface (simulated responses based on subject/class context)
- Navigation: Home, Classes, Quiz, Doubts, Progress

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan

**Backend (Motoko):**
- Store student progress: lessons completed, quiz scores
- Store doubts submitted by students with responses
- Store quiz questions per class/subject
- Store subjects and lessons per class
- APIs: getClasses, getSubjects(class), getLessons(class, subject), getQuizQuestions(class, subject), submitDoubt, getDoubts, updateProgress, getProgress

**Frontend (React):**
- Landing/home page with class selector grid (1-12)
- Subject page for selected class
- Lesson viewer page with video placeholder and notes
- Quiz page with MCQ questions, score tracking
- Doubt submission form and answers list
- Progress dashboard showing completed lessons and quiz scores
- AI Chat page: simple chat UI with pre-defined educational responses
- Responsive mobile-first layout suitable for Indian students
