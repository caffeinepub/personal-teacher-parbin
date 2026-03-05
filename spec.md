# Personal Teacher: Parbin

## Current State
- Full-stack educational app with Class 1-12, subjects, lessons, quiz, doubts, polls
- Admin panel password-protected with "PARBINDIHURI"
- Backend: Motoko with Lesson type having `videoUrl`, `shortVideoUrl`, `longVideoUrl`, `pdfUrl`, `notes`, `title`, `description`
- backend.d.ts has `shortVideoUrl` and `longVideoUrl` in Lesson interface
- Admin panel Video tab has only one `videoUrl` field — missing shortVideoUrl and longVideoUrl inputs
- Content add bug: addLesson calls in PDF/Video/Notes tabs don't pass `shortVideoUrl` and `longVideoUrl` fields, causing backend type mismatch
- SubjectPage LessonCard shows only `lesson.videoUrl` — doesn't use shortVideoUrl or longVideoUrl

## Requested Changes (Diff)

### Add
- Admin Video tab: two URL inputs — "Short Video URL" (YouTube Shorts/vertical) and "Long Video URL" (full lecture/landscape)
- SubjectPage LessonCard: show short video in portrait (9:16) ratio box, long video in landscape (16:9) box; if both present show toggle between them

### Modify
- Admin PDF/Video/Notes lesson addLesson calls: include all required fields (`shortVideoUrl: ""`, `longVideoUrl: ""`) to fix content-add bug
- Admin Video tab: replace single videoUrl field with shortVideoUrl + longVideoUrl state and inputs; submit both to addLesson
- SubjectPage LessonCard: smart video display — check shortVideoUrl and longVideoUrl, show appropriate aspect ratio, toggle if both exist; fallback to videoUrl for backward compat

### Remove
- Single `videoUrl` input from Admin Video tab (keep backward compat in rendering by checking `lesson.videoUrl` as fallback)

## Implementation Plan
1. Fix AdminPage.tsx:
   a. Add `shortVideoUrl` and `longVideoUrl` state variables
   b. Update Video tab form: two labeled URL inputs for short video and long video
   c. Update handleVideoSubmit to submit both shortVideoUrl and longVideoUrl
   d. Fix PDF/Notes submit handlers: add `shortVideoUrl: ""`, `longVideoUrl: ""` to lesson object
   e. Update existing lessons list badges: show "Short Video" and "Long Video" badges
2. Fix SubjectPage.tsx LessonCard:
   a. Portrait box (aspect-[9/16]) for shortVideoUrl
   b. Landscape box (aspect-video) for longVideoUrl or videoUrl fallback
   c. If both present: show toggle button between Short and Long video
3. Fix FALLBACK_LESSONS to include shortVideoUrl and longVideoUrl fields
4. Build and validate
