# Personal Teacher: Parbin

## Current State

Admin panel mein lessons add karne ka ek single form hai jisme title, description, video URL, PDF URL, aur text notes ke fields hain. Quiz questions ke liye alag section hai. Poll feature bilkul nahi hai. Lesson add karne mein problem aa rahi hai kyunki form complex hai aur content types ek saath mixed hain.

## Requested Changes (Diff)

### Add
- Admin panel ke lesson form mein **5 alag content type tabs**:
  1. **PDF** — URL field (link paste karne ka option, type karne ka bhi)
  2. **Video** — YouTube/video URL field (link paste ya type)
  3. **Notes** — Rich textarea (type + paste dono supported, large area)
  4. **Poll** — Poll question + multiple options (min 2, max 6) add karne ka form
  5. **Quiz** — Quiz question + 4 options + correct answer selector (existing quiz form yahan shift)
- Backend mein `Poll` type aur `addPoll`, `getPolls` APIs
- Admin dashboard mein Polls ka ek naya dedicated section (content type tabs ke andar)
- Student side mein polls dekh kar vote karne ki functionality

### Modify
- Existing `LessonForm` ko restructure karo: title + description pehle, phir **content tabs** (PDF / Video / Notes / Poll / Quiz) jahan se ek ya zyada content types add ho sakein
- Lesson add button har content tab ke andar ho — ek click mein sirf us type ka content save ho
- Admin tabs mein "Poll" badge add karo

### Remove
- Purana combined lesson form (jisme sab fields ek saath the) replace ho jaayega naye tabbed system se

## Implementation Plan

1. **Backend**: `Poll` type define karo (`question: Text`, `options: [Text]`, `classNum: Nat`, `subject: Text`). `pollStore` add karo. `addPoll(classNum, subject, poll)` aur `getPolls(classNum, subject)` APIs add karo (admin-only add, public get).
2. **Frontend - AdminPage**: 
   - `LessonForm` ko refactor karo: title + description common fields, phir 5 tab buttons (PDF, Video, Notes, Poll, Quiz)
   - PDF tab: URL input + save button
   - Video tab: URL input + save button  
   - Notes tab: large textarea (typing + paste) + save button
   - Poll tab: poll question input + dynamic options (Add/Remove option) + save button
   - Quiz tab: existing quiz form yahan move karo
3. **Frontend - SubjectPage (student view)**: Polls section add karo jahan students poll options dekh ke vote kar sakein
4. **Backend.d.ts** update karo Poll types ke saath
