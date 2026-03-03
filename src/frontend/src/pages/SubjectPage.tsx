import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Loader2,
  MessageSquare,
  PlayCircle,
  Send,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Lesson, QuizQuestion } from "../backend.d";
import {
  useCompleteLesson,
  useGetDoubtsByClassSubject,
  useGetLessons,
  useGetQuizQuestions,
  useSubmitDoubt,
  useSubmitQuizScore,
} from "../hooks/useQueries";

// Fallback lessons for demo content
const FALLBACK_LESSONS: Lesson[] = [
  {
    title: "Introduction — Pehla Chapter",
    description:
      "Is chapter mein hum basic concepts ko samjhenge jo poori class ki neev hai.",
    notes:
      "📝 Key Points:\n• Sabse pehle fundamentals yaad karein\n• Practice problems zaroor karo\n• Notes ko bar bar review karo\n• Teacher se doubt poochne mein dar mat lagao",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Chapter 2 — Core Concepts",
    description:
      "Yahan hum is subject ke main topics cover karenge with examples.",
    notes:
      "📝 Important Topics:\n• Topic A: Definition aur explanation\n• Topic B: Real-world examples\n• Topic C: Practice exercises\n• Revision tips aur mnemonics",
    videoUrl: "",
  },
  {
    title: "Chapter 3 — Advanced Topics",
    description:
      "Is chapter mein hum thoda advanced material dekhenge aur exam preparation karenge.",
    notes:
      "📝 Exam Tips:\n• Important formulas yaad karein\n• Previous year questions practice karein\n• Diagrams banao\n• Time management sikhein",
    videoUrl: "",
  },
];

const FALLBACK_QUIZ: QuizQuestion[] = [
  {
    question: "Is subject mein sabse pehla concept kya hai?",
    correctIndex: BigInt(0),
    options: [
      "Fundamentals aur basics",
      "Advanced theory",
      "Practical experiments",
      "Koi bhi nahi",
    ],
  },
  {
    question: "Practice karne se kya hota hai?",
    correctIndex: BigInt(1),
    options: [
      "Kuch nahi badalta",
      "Knowledge improve hoti hai",
      "Sirf time waste hota hai",
      "Exams aur bure ho jaate hain",
    ],
  },
  {
    question: "Notes kab review karne chahiye?",
    correctIndex: BigInt(2),
    options: [
      "Sirf exam se ek din pehle",
      "Kabhi nahi",
      "Regularly bar bar",
      "Sirf class mein",
    ],
  },
];

// ─── Lesson Card ──────────────────────────────────────────────────────────────

function LessonCard({
  lesson,
  index,
  completedSet,
  onComplete,
}: {
  lesson: Lesson;
  index: number;
  classNum?: string;
  subject?: string;
  completedSet: Set<string>;
  onComplete: (title: string) => void;
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const isCompleted = completedSet.has(lesson.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Video placeholder */}
      <div className="relative bg-foreground/5 aspect-video flex items-center justify-center group">
        {lesson.videoUrl ? (
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={lesson.title}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <PlayCircle className="w-14 h-14 opacity-40" />
            <span className="text-sm">Video coming soon...</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <Badge variant="secondary" className="text-xs mb-1.5">
              Lesson {index + 1}
            </Badge>
            <h3 className="font-display font-bold text-base text-foreground">
              {lesson.title}
            </h3>
          </div>
          {isCompleted && (
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {lesson.description}
        </p>

        {/* Notes toggle */}
        {lesson.notes && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setNotesOpen(!notesOpen)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {notesOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              Notes {notesOpen ? "chhupao" : "dekho"}
            </button>
            <AnimatePresence>
              {notesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-4 bg-secondary rounded-xl text-sm text-foreground whitespace-pre-line font-body">
                    {lesson.notes}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <Button
          size="sm"
          data-ocid={`lesson.complete.button.${index + 1}`}
          disabled={isCompleted}
          onClick={() => onComplete(lesson.title)}
          className={`w-full rounded-xl font-semibold ${
            isCompleted
              ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-100"
              : ""
          }`}
          variant={isCompleted ? "outline" : "default"}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completed! ✅
            </>
          ) : (
            "Mark as Complete ✓"
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Quiz Tab ─────────────────────────────────────────────────────────────────

function QuizTab({
  questions,
  classNum,
  subject,
}: {
  questions: QuizQuestion[];
  classNum: string;
  subject: string;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const submitScore = useSubmitQuizScore();

  const totalQ = questions.length;
  const current = questions[currentQ];

  const handleSelect = (optIdx: number) => {
    if (submitted) return;
    const updated = [...selectedAnswers];
    updated[currentQ] = optIdx;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentQ < totalQ - 1) {
      setCurrentQ((q) => q + 1);
    }
  };

  const handleSubmit = async () => {
    const score = questions.reduce((acc, q, i) => {
      return acc + (selectedAnswers[i] === Number(q.correctIndex) ? 1 : 0);
    }, 0);

    setSubmitted(true);
    try {
      await submitScore.mutateAsync({
        classNum: Number.parseInt(classNum),
        subject,
        score,
      });
      toast.success(`Score submit ho gaya! ${score}/${totalQ} sahi ✨`);
    } catch {
      toast.error("Score save nahi ho saka.");
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelectedAnswers([]);
    setSubmitted(false);
  };

  if (totalQ === 0) {
    return (
      <div
        data-ocid="quiz.empty_state"
        className="flex flex-col items-center py-16 gap-4 text-center"
      >
        <div className="text-5xl">📝</div>
        <h3 className="font-display font-bold text-xl text-foreground">
          Quiz Abhi Available Nahi
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Is subject ke liye abhi koi quiz available nahi hai. Thodi der mein
          check karein!
        </p>
      </div>
    );
  }

  if (submitted) {
    const score = questions.reduce(
      (acc, q, i) =>
        acc + (selectedAnswers[i] === Number(q.correctIndex) ? 1 : 0),
      0,
    );
    const pct = Math.round((score / totalQ) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center py-12 gap-6 text-center"
        data-ocid="quiz.success_state"
      >
        <div className="text-6xl">
          {pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}
        </div>
        <div>
          <h3 className="font-display font-black text-4xl text-foreground">
            {score}/{totalQ}
          </h3>
          <p className="text-muted-foreground mt-1">
            {pct >= 80
              ? "Bahut badhiya! Shabash! 🌟"
              : pct >= 50
                ? "Accha kiya! Thoda aur practice karo 📚"
                : "Koi baat nahi! Revision karo aur dobara try karo 💪"}
          </p>
        </div>
        <Button onClick={handleReset} className="rounded-xl" variant="outline">
          Dobara Khelein 🔄
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">
          Question {currentQ + 1} of {totalQ}
        </span>
        <div className="flex gap-1">
          {questions.map((q, i) => (
            <div
              key={q.question.slice(0, 20)}
              className={`h-2 w-6 rounded-full transition-colors ${
                i < currentQ
                  ? "bg-green-400"
                  : i === currentQ
                    ? "bg-primary"
                    : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Question */}
          <div className="bg-secondary rounded-2xl p-6 mb-6">
            <p className="font-display font-semibold text-lg text-foreground leading-snug">
              {current.question}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {current.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQ] === optIdx;
              return (
                <label
                  key={option}
                  data-ocid="quiz.option.radio"
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "border-primary bg-primary/8 font-medium"
                      : "border-border bg-card hover:border-primary/40 hover:bg-secondary"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${currentQ}`}
                    value={optIdx}
                    checked={isSelected}
                    onChange={() => handleSelect(optIdx)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">{option}</span>
                </label>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {currentQ < totalQ - 1 ? (
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQ] === undefined}
            className="flex-1 rounded-xl"
          >
            Agle Question →
          </Button>
        ) : (
          <Button
            data-ocid="quiz.submit.button"
            onClick={handleSubmit}
            disabled={
              selectedAnswers[currentQ] === undefined || submitScore.isPending
            }
            className="flex-1 rounded-xl"
          >
            {submitScore.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trophy className="w-4 h-4 mr-2" />
            )}
            Result Dekho!
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Doubts Tab ───────────────────────────────────────────────────────────────

function DoubtsTab({
  classNum,
  subject,
}: {
  classNum: string;
  subject: string;
}) {
  const [studentName, setStudentName] = useState("");
  const [question, setQuestion] = useState("");

  const { data: doubts, isLoading: doubtsLoading } = useGetDoubtsByClassSubject(
    Number.parseInt(classNum),
    subject,
  );
  const submitDoubt = useSubmitDoubt();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !question.trim()) {
      toast.error("Naam aur doubt dono zaroor bharein!");
      return;
    }

    try {
      await submitDoubt.mutateAsync({
        studentName: studentName.trim(),
        classNum: Number.parseInt(classNum),
        subject,
        question: question.trim(),
      });
      toast.success("Aapka doubt submit ho gaya! 📨");
      setStudentName("");
      setQuestion("");
    } catch {
      toast.error("Submit nahi ho saka. Dobara try karein.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-secondary rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-lg text-foreground">
            Apna Doubt Poochho
          </h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentName" className="text-sm font-medium">
            Aapka Naam
          </Label>
          <Input
            id="studentName"
            data-ocid="doubt.name.input"
            placeholder="Apna naam likhein..."
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="question" className="text-sm font-medium">
            Aapka Doubt / Sawaal
          </Label>
          <Textarea
            id="question"
            data-ocid="doubt.question.textarea"
            placeholder="Yahan apna sawaal likhein..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="rounded-xl resize-none"
            rows={4}
            required
          />
        </div>

        <Button
          type="submit"
          data-ocid="doubt.submit_button"
          disabled={submitDoubt.isPending}
          className="w-full rounded-xl font-semibold"
        >
          {submitDoubt.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Doubt Submit Karein
        </Button>
      </form>

      {/* Doubts list */}
      <div>
        <h3 className="font-display font-bold text-lg text-foreground mb-4">
          Previous Doubts
        </h3>

        {doubtsLoading && (
          <div
            data-ocid="doubt.loading_state"
            className="flex items-center gap-3 text-muted-foreground py-6"
          >
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Doubts load ho rahe hain...</span>
          </div>
        )}

        {!doubtsLoading && (!doubts || doubts.length === 0) && (
          <div
            data-ocid="doubt.empty_state"
            className="text-center py-10 text-muted-foreground"
          >
            <div className="text-4xl mb-3">💬</div>
            <p className="text-sm">
              Abhi tak koi doubt nahi aaya. Pehle aap poochho!
            </p>
          </div>
        )}

        {doubts && doubts.length > 0 && (
          <div className="space-y-3">
            {doubts.map((doubt, i) => (
              <motion.div
                key={`${doubt.studentName}-${doubt.question.slice(0, 15)}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {doubt.studentName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-foreground">
                    {doubt.studentName}
                  </span>
                </div>
                <p className="text-sm text-foreground mb-3">
                  ❓ {doubt.question}
                </p>
                {doubt.answer ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">
                      👨‍🏫 Teacher ka Jawab:
                    </p>
                    <p className="text-sm text-green-800">{doubt.answer}</p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-700 font-medium">
                      ⏳ Awaiting answer... Parbin ji jald jawab denge!
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main SubjectPage ──────────────────────────────────────────────────────────

export default function SubjectPage() {
  const { classNum, subject } = useParams({
    from: "/class/$classNum/subject/$subject",
  });
  const navigate = useNavigate();

  const {
    data: lessons,
    isLoading: lessonsLoading,
    isError: lessonsError,
  } = useGetLessons(Number.parseInt(classNum), subject);

  const { data: quizQuestions, isLoading: quizLoading } = useGetQuizQuestions(
    Number.parseInt(classNum),
    subject,
  );

  const [completedTitles, setCompletedTitles] = useState<Set<string>>(
    new Set(),
  );
  const completeLesson = useCompleteLesson();

  const handleComplete = async (lessonTitle: string) => {
    try {
      await completeLesson.mutateAsync({
        classNum: Number.parseInt(classNum),
        subject,
        lessonTitle,
      });
      setCompletedTitles((prev) => new Set([...prev, lessonTitle]));
      toast.success("Lesson complete! Bahut badhiya! 🌟");
    } catch {
      toast.error("Save nahi ho saka.");
    }
  };

  const displayLessons =
    !lessonsLoading && (!lessons || lessons.length === 0)
      ? FALLBACK_LESSONS
      : (lessons ?? []);

  const displayQuiz =
    !quizLoading && (!quizQuestions || quizQuestions.length === 0)
      ? FALLBACK_QUIZ
      : (quizQuestions ?? []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate({ to: "/class/$classNum", params: { classNum } })
          }
          className="rounded-xl"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Class {classNum}</p>
          <h1 className="font-display font-black text-3xl text-foreground">
            {subject}
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="lessons">
        <TabsList className="w-full mb-6 rounded-2xl h-12 bg-secondary">
          <TabsTrigger
            value="lessons"
            className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-semibold"
            data-ocid="subject.lessons.tab"
          >
            📚 Lessons
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-semibold"
            data-ocid="subject.quiz.tab"
          >
            🧠 Quiz
          </TabsTrigger>
          <TabsTrigger
            value="doubts"
            className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-semibold"
            data-ocid="subject.doubts.tab"
          >
            💬 Doubts
          </TabsTrigger>
        </TabsList>

        {/* Lessons */}
        <TabsContent value="lessons">
          {lessonsLoading && (
            <div
              data-ocid="lesson.loading_state"
              className="flex items-center justify-center py-16 gap-3 text-muted-foreground"
            >
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>Lessons load ho rahe hain...</span>
            </div>
          )}

          {lessonsError && (
            <div
              data-ocid="lesson.error_state"
              className="flex flex-col items-center py-16 gap-4 text-center text-muted-foreground"
            >
              <div className="text-4xl">😕</div>
              <p>Lessons load nahi ho sake. Thodi der baad try karein.</p>
            </div>
          )}

          {!lessonsLoading && (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1">
              {displayLessons.map((lesson, idx) => (
                <LessonCard
                  key={lesson.title}
                  lesson={lesson}
                  index={idx}
                  classNum={classNum}
                  subject={subject}
                  completedSet={completedTitles}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Quiz */}
        <TabsContent value="quiz">
          {quizLoading ? (
            <div
              data-ocid="quiz.loading_state"
              className="flex items-center justify-center py-16 gap-3 text-muted-foreground"
            >
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>Quiz load ho raha hai...</span>
            </div>
          ) : (
            <QuizTab
              questions={displayQuiz}
              classNum={classNum}
              subject={subject}
            />
          )}
        </TabsContent>

        {/* Doubts */}
        <TabsContent value="doubts">
          <DoubtsTab classNum={classNum} subject={subject} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
