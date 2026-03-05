import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Send,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddLesson,
  useAddQuizQuestion,
  useAnswerDoubt,
  useGetAllDoubts,
  useGetLessons,
  useGetQuizQuestions,
  useGetUnansweredDoubts,
} from "../hooks/useQueries";

const ADMIN_PASSWORD = "PARBINDIHURI";

const CLASSES = Array.from({ length: 12 }, (_, i) => i + 1);
const SUBJECTS = [
  "Maths",
  "Science",
  "English",
  "Hindi",
  "Social Science",
  "Computer",
];
const OPTIONS_LABELS = ["A", "B", "C", "D"] as const;

// ─── Password Screen ───────────────────────────────────────────────────────────

function AdminPasswordScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (password === ADMIN_PASSWORD) {
        toast.success("Admin panel mein aapka swagat hai!");
        onSuccess();
      } else {
        setError("Password galat hai. Dobara try karein.");
        setPassword("");
      }
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-border shadow-xl rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-accent" />
          <CardHeader className="text-center pt-8 pb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-display font-black text-2xl text-foreground">
              Admin Login
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm leading-relaxed">
              Sirf <strong className="text-foreground">Umesh Singh</strong> ke
              liye. Password darj karein aage jaane ke liye.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="admin-password"
                  className="text-sm font-semibold"
                >
                  Password
                </Label>
                <Input
                  id="admin-password"
                  data-ocid="admin.password.input"
                  type="password"
                  placeholder="Password yahan likhein..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="rounded-xl h-12 text-base"
                  autoFocus
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div
                  data-ocid="admin.password.error_state"
                  className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive"
                >
                  <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {loading && (
                <div
                  data-ocid="admin.password.loading_state"
                  className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-primary"
                >
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Verify ho raha hai...</span>
                </div>
              )}

              <Button
                type="submit"
                data-ocid="admin.password.submit_button"
                disabled={loading || !password.trim()}
                className="w-full h-12 rounded-2xl font-bold text-base shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verify ho raha hai...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Admin Panel Kholo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── Lesson Form ───────────────────────────────────────────────────────────────

function LessonForm({
  classNum,
  subject,
}: {
  classNum: number;
  subject: string;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [notes, setNotes] = useState("");

  const addLesson = useAddLesson();
  const { data: lessons, isLoading: lessonsLoading } = useGetLessons(
    classNum,
    subject,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title zaroor bharein!");
      return;
    }
    try {
      await addLesson.mutateAsync({
        classNum,
        subject,
        lesson: {
          title: title.trim(),
          description: description.trim(),
          videoUrl: videoUrl.trim(),
          pdfUrl: pdfUrl.trim(),
          notes: notes.trim(),
        },
      });
      toast.success("Lesson add ho gaya! 🎉");
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setPdfUrl("");
      setNotes("");
    } catch {
      toast.error("Lesson add nahi ho saka. Dobara try karein.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Lesson Form */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="font-display font-bold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Lesson Add Karein
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-title" className="text-sm font-semibold">
                Lesson Title *
              </Label>
              <Input
                id="lesson-title"
                data-ocid="admin.lesson.title.input"
                placeholder="e.g. Chapter 1 — Integers ka Introduction"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="lesson-description"
                className="text-sm font-semibold"
              >
                Description
              </Label>
              <Textarea
                id="lesson-description"
                data-ocid="admin.lesson.description.textarea"
                placeholder="Is lesson mein kya sikhenge..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lesson-video" className="text-sm font-semibold">
                  YouTube Video URL
                </Label>
                <Input
                  id="lesson-video"
                  data-ocid="admin.lesson.video_url.input"
                  placeholder="https://youtube.com/embed/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lesson-pdf" className="text-sm font-semibold">
                  PDF Notes URL
                </Label>
                <Input
                  id="lesson-pdf"
                  data-ocid="admin.lesson.pdf_url.input"
                  placeholder="https://drive.google.com/..."
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-notes" className="text-sm font-semibold">
                Text Notes
              </Label>
              <Textarea
                id="lesson-notes"
                data-ocid="admin.lesson.notes.textarea"
                placeholder="Key points, formulas, important topics..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-xl resize-none font-mono text-sm"
                rows={5}
              />
            </div>

            <Button
              type="submit"
              data-ocid="admin.lesson.submit_button"
              disabled={addLesson.isPending}
              className="w-full h-11 rounded-xl font-bold"
            >
              {addLesson.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Lesson Add Karein
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Lessons */}
      <div>
        <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Existing Lessons
          {lessons && (
            <Badge variant="secondary" className="ml-1">
              {lessons.length}
            </Badge>
          )}
        </h3>

        {lessonsLoading && (
          <div
            data-ocid="admin.lessons.loading_state"
            className="flex items-center gap-3 text-muted-foreground py-8"
          >
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Lessons load ho rahe hain...</span>
          </div>
        )}

        {!lessonsLoading && (!lessons || lessons.length === 0) && (
          <div
            data-ocid="admin.lessons.empty_state"
            className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-2xl"
          >
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">
              Is class/subject ke liye abhi koi lesson nahi hai.
            </p>
            <p className="text-xs mt-1">Upar form se add karein!</p>
          </div>
        )}

        {lessons && lessons.length > 0 && (
          <div className="space-y-3">
            {lessons.map((lesson, i) => (
              <motion.div
                key={`${lesson.title}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4"
                data-ocid={`admin.lesson.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        Lesson {i + 1}
                      </Badge>
                      {lesson.videoUrl && (
                        <Badge className="text-xs bg-red-100 text-red-700 border-red-200">
                          🎥 Video
                        </Badge>
                      )}
                      {lesson.pdfUrl && (
                        <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                          📄 PDF
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {lesson.title}
                    </h4>
                    {lesson.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Quiz Form ─────────────────────────────────────────────────────────────────

function QuizForm({
  classNum,
  subject,
}: {
  classNum: number;
  subject: string;
}) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<number>(0);

  const addQuizQuestion = useAddQuizQuestion();
  const { data: quizQuestions, isLoading: quizLoading } = useGetQuizQuestions(
    classNum,
    subject,
  );

  const handleOptionChange = (idx: number, value: string) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error("Question zaroor bharein!");
      return;
    }
    const filledOptions = options.filter((o) => o.trim());
    if (filledOptions.length < 2) {
      toast.error("Kam se kam 2 options zaroor bharein!");
      return;
    }

    try {
      await addQuizQuestion.mutateAsync({
        classNum,
        subject,
        question: {
          question: question.trim(),
          options: options.map((o) => o.trim()),
          correctIndex: BigInt(correctIndex),
        },
      });
      toast.success("Question add ho gaya! 🧠");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(0);
    } catch {
      toast.error("Question add nahi ho saka. Dobara try karein.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Quiz Question Form */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="font-display font-bold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Question Add Karein
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="quiz-question" className="text-sm font-semibold">
                Question *
              </Label>
              <Textarea
                id="quiz-question"
                data-ocid="admin.quiz.question.textarea"
                placeholder="Aapka question yahan likhein..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="rounded-xl resize-none"
                rows={3}
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Options</Label>
              <div className="grid sm:grid-cols-2 gap-3">
                {OPTIONS_LABELS.map((label, idx) => (
                  <div key={label} className="space-y-1.5">
                    <Label
                      htmlFor={`quiz-option-${label.toLowerCase()}`}
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Option {label}
                    </Label>
                    <Input
                      id={`quiz-option-${label.toLowerCase()}`}
                      data-ocid={`admin.quiz.option_${label.toLowerCase()}.input`}
                      placeholder={`Option ${label}...`}
                      value={options[idx]}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Sahi Jawab</Label>
              <div className="flex gap-3 flex-wrap">
                {OPTIONS_LABELS.map((label, idx) => (
                  <label
                    key={label}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                      correctIndex === idx
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={idx}
                      checked={correctIndex === idx}
                      onChange={() => setCorrectIndex(idx)}
                      className="w-4 h-4 accent-primary"
                    />
                    Option {label}
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              data-ocid="admin.quiz.submit_button"
              disabled={addQuizQuestion.isPending}
              className="w-full h-11 rounded-xl font-bold"
            >
              {addQuizQuestion.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Question Add Karein
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Questions */}
      <div>
        <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          Existing Questions
          {quizQuestions && (
            <Badge variant="secondary" className="ml-1">
              {quizQuestions.length}
            </Badge>
          )}
        </h3>

        {quizLoading && (
          <div
            data-ocid="admin.quiz.loading_state"
            className="flex items-center gap-3 text-muted-foreground py-8"
          >
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Questions load ho rahe hain...</span>
          </div>
        )}

        {!quizLoading && (!quizQuestions || quizQuestions.length === 0) && (
          <div
            data-ocid="admin.quiz.empty_state"
            className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-2xl"
          >
            <BrainCircuit className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">
              Is class/subject ke liye abhi koi question nahi hai.
            </p>
          </div>
        )}

        {quizQuestions && quizQuestions.length > 0 && (
          <div className="space-y-3">
            {quizQuestions.map((q, i) => (
              <motion.div
                key={`${q.question.slice(0, 20)}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4"
                data-ocid={`admin.quiz.item.${i + 1}`}
              >
                <div className="flex items-start gap-3">
                  <Badge
                    variant="secondary"
                    className="text-xs shrink-0 mt-0.5"
                  >
                    Q{i + 1}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-2 leading-snug">
                      {q.question}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {q.options.map((opt, optIdx) => (
                        <span
                          key={opt}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                            optIdx === Number(q.correctIndex)
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {OPTIONS_LABELS[optIdx]}: {opt}
                          {optIdx === Number(q.correctIndex) && " ✓"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Doubts Panel ──────────────────────────────────────────────────────────────

function DoubtsPanel() {
  const { data: unansweredDoubts, isLoading: unansweredLoading } =
    useGetUnansweredDoubts();
  const { data: allDoubts, isLoading: allLoading } = useGetAllDoubts();
  const answerDoubt = useAnswerDoubt();

  const [answers, setAnswers] = useState<Record<number, string>>({});

  const answeredDoubts = allDoubts?.filter((d) => d.answer) ?? [];
  const isLoading = unansweredLoading || allLoading;

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmitAnswer = async (
    _doubt: NonNullable<typeof unansweredDoubts>[number],
    globalIndex: number,
  ) => {
    const answer = answers[globalIndex];
    if (!answer?.trim()) {
      toast.error("Jawab likhein pehle!");
      return;
    }
    try {
      await answerDoubt.mutateAsync({
        index: globalIndex,
        answer: answer.trim(),
      });
      toast.success("Jawab submit ho gaya! 👨‍🏫");
      setAnswers((prev) => {
        const updated = { ...prev };
        delete updated[globalIndex];
        return updated;
      });
    } catch {
      toast.error("Jawab submit nahi ho saka. Dobara try karein.");
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="admin.doubts.loading_state"
        className="flex items-center gap-3 text-muted-foreground py-12"
      >
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span>Doubts load ho rahe hain...</span>
      </div>
    );
  }

  // Find global index for each unanswered doubt
  const getDoubtIndex = (
    doubt: NonNullable<typeof unansweredDoubts>[number],
  ) => {
    if (!allDoubts) return -1;
    return allDoubts.findIndex(
      (d) =>
        d.studentName === doubt.studentName &&
        d.question === doubt.question &&
        d.classNum === doubt.classNum &&
        d.subject === doubt.subject,
    );
  };

  return (
    <div className="space-y-8">
      {/* Unanswered Doubts */}
      <div>
        <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          Unanswered Doubts
          {unansweredDoubts && unansweredDoubts.length > 0 && (
            <Badge className="ml-1 bg-amber-100 text-amber-700 border-amber-200">
              {unansweredDoubts.length} pending
            </Badge>
          )}
        </h3>

        {!unansweredDoubts || unansweredDoubts.length === 0 ? (
          <div
            data-ocid="admin.doubts.empty_state"
            className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-2xl"
          >
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <p className="text-sm font-medium">
              Sab doubts ka jawab de diya! Shabash! 🎉
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {unansweredDoubts.map((doubt, i) => {
              const globalIdx = getDoubtIndex(doubt);
              return (
                <motion.div
                  key={`${doubt.studentName}-${doubt.question.slice(0, 20)}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card border-2 border-amber-200/60 rounded-2xl p-5"
                  data-ocid={`admin.doubt.item.${i + 1}`}
                >
                  {/* Student info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <span className="text-sm font-black text-primary">
                        {doubt.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {doubt.studentName}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-xs">
                          Class {doubt.classNum.toString()}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {doubt.subject}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <p className="text-sm text-amber-900 leading-relaxed">
                      ❓ {doubt.question}
                    </p>
                  </div>

                  {/* Answer form */}
                  <div className="space-y-3">
                    <Label
                      htmlFor={`answer-${i}`}
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      Jawab Likhein
                    </Label>
                    <Textarea
                      id={`answer-${i}`}
                      data-ocid={`admin.doubt.answer.textarea.${i + 1}`}
                      placeholder="Student ka jawab yahan likhein..."
                      value={answers[globalIdx] ?? ""}
                      onChange={(e) =>
                        handleAnswerChange(globalIdx, e.target.value)
                      }
                      className="rounded-xl resize-none"
                      rows={3}
                    />
                    <Button
                      data-ocid={`admin.doubt.answer.submit_button.${i + 1}`}
                      onClick={() => handleSubmitAnswer(doubt, globalIdx)}
                      disabled={
                        answerDoubt.isPending || !answers[globalIdx]?.trim()
                      }
                      size="sm"
                      className="w-full rounded-xl font-semibold"
                    >
                      {answerDoubt.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Jawab Submit Karein
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Answered Doubts (Collapsed Section) */}
      {answeredDoubts.length > 0 && (
        <AnsweredDoubtsCollapsible doubts={answeredDoubts} />
      )}
    </div>
  );
}

function AnsweredDoubtsCollapsible({
  doubts,
}: {
  doubts: {
    studentName: string;
    classNum: bigint;
    subject: string;
    question: string;
    answer?: string;
  }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-display font-bold text-base text-foreground hover:text-primary transition-colors mb-4"
      >
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        Answered Doubts
        <Badge className="bg-green-100 text-green-700 border-green-200">
          {doubts.length}
        </Badge>
        <span className="text-muted-foreground text-sm ml-1 font-normal">
          {open ? "▲ chhupao" : "▼ dekho"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden space-y-3"
          >
            {doubts.map((doubt, i) => (
              <div
                key={`answered-${doubt.studentName}-${i}`}
                className="bg-card border border-green-200/70 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-700">
                      {doubt.studentName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-sm">
                    {doubt.studentName}
                  </span>
                  <Badge className="text-xs bg-green-100 text-green-700 border-green-200 ml-auto">
                    ✓ Answered
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  ❓ {doubt.question}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-green-700 mb-0.5">
                    👨‍🏫 Aapka Jawab:
                  </p>
                  <p className="text-sm text-green-800">{doubt.answer}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [selectedClass, setSelectedClass] = useState(6);
  const [selectedSubject, setSelectedSubject] = useState("Maths");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">
              Admin Panel
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-foreground">
            Content Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Lessons, quiz questions aur student doubts manage karein
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            data-ocid="admin.logout.button"
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="rounded-xl font-semibold border-2"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Logout
          </Button>
        </div>
      </motion.div>

      {/* Class & Subject Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4 mb-6 flex flex-wrap gap-4"
      >
        <div className="flex items-center gap-3 flex-1 min-w-[160px]">
          <Label className="text-sm font-bold whitespace-nowrap">
            Class Chuniye:
          </Label>
          <Select
            value={String(selectedClass)}
            onValueChange={(v) => setSelectedClass(Number(v))}
          >
            <SelectTrigger
              data-ocid="admin.class.select"
              className="rounded-xl h-10 font-semibold"
            >
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {CLASSES.map((c) => (
                <SelectItem key={c} value={String(c)}>
                  Class {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <Label className="text-sm font-bold whitespace-nowrap">
            Subject:
          </Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger
              data-ocid="admin.subject.select"
              className="rounded-xl h-10 font-semibold"
            >
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Tabs defaultValue="lessons">
          <TabsList className="w-full mb-6 rounded-2xl h-12 bg-secondary">
            <TabsTrigger
              value="lessons"
              data-ocid="admin.lessons.tab"
              className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-semibold text-xs sm:text-sm"
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              Lessons & Notes
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              data-ocid="admin.quiz.tab"
              className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-semibold text-xs sm:text-sm"
            >
              <BrainCircuit className="w-4 h-4 mr-1.5" />
              Quiz Questions
            </TabsTrigger>
            <TabsTrigger
              value="doubts"
              data-ocid="admin.doubts.tab"
              className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-semibold text-xs sm:text-sm"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" />
              Student Doubts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons">
            <LessonForm classNum={selectedClass} subject={selectedSubject} />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizForm classNum={selectedClass} subject={selectedSubject} />
          </TabsContent>

          <TabsContent value="doubts">
            <DoubtsPanel />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminPasswordScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
}
