# Personal Teacher: Parbin

## Current State

App already has:
- Class 1-12 selector on homepage
- SubjectPage with Lessons, Quiz, Doubts tabs
- Lessons stored in backend (addLesson / getLessons)
- Quiz questions stored in backend (addQuizQuestion / getQuizQuestions)
- Doubt submission and answering via backend
- Progress tracking (completeLesson, quizScores)
- Parbin AI chat page
- User photo as navbar logo

## Requested Changes (Diff)

### Add
- Admin Content Management System (CMS) page at `/admin`
- Admin login via Internet Identity (authorization component)
- Admin can add new lessons: title, description, YouTube video URL, notes text
- Admin can add PDF notes link to a lesson (as a URL field)
- Admin can add quiz questions: question text, 4 options, correct answer index
- Admin can answer pending student doubts from the CMS
- Admin can view all lessons and quiz questions per class/subject
- Backend: add `pdfUrl` field to Lesson type
- Backend: admin-only guards on addLesson, addQuizQuestion, answerDoubt

### Modify
- SubjectPage Lesson card: if `pdfUrl` is present, show a "PDF Notes Download" button
- Backend `Lesson` type: add `pdfUrl: Text` field
- `addLesson` and `getLessons` to handle `pdfUrl`

### Remove
- Nothing removed

## Implementation Plan

1. Update backend: add `pdfUrl` to `Lesson` type, regenerate backend.d.ts
2. Select `authorization` component for admin login
3. Generate new Motoko backend with updated Lesson type and admin-role checks
4. Create `/admin` route in App.tsx
5. Build AdminPage with:
   - Login button (Internet Identity)
   - Class + Subject selector
   - Lesson form (title, description, videoUrl, pdfUrl, notes) + lesson list
   - Quiz question form (question, 4 options, correct index) + question list
   - Doubts tab: show unanswered doubts with answer input field
6. Update SubjectPage LessonCard to show PDF download button when pdfUrl present
7. Add "Admin" link in NavBar (visible to all, auth enforced on page)
