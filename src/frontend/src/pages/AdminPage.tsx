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
  BarChart2,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  FileText,
  HelpCircle,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Send,
  ShieldCheck,
  StickyNote,
  Trash2,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddLesson,
  useAddPoll,
  useAddQuizQuestion,
  useAnswerDoubt,
  useGetAllDoubts,
  useGetLessons,
  useGetPolls,
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

// ─── Content Form (PDF / Video / Notes / Poll / Quiz tabs) ─────────────────────

function LessonForm({
  classNum,
  subject,
}: {
  classNum: number;
  subject: string;
}) {
  // Common fields (for PDF / Video / Notes)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // PDF tab state
  const [pdfUrl, setPdfUrl] = useState("");

  // Video tab state
  const [videoUrl, setVideoUrl] = useState("");

  // Notes tab state
  const [notes, setNotes] = useState("");

  // Poll tab state
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollNextId, setPollNextId] = useState(2);
  const [pollOptions, setPollOptions] = useState<
    { id: number; value: string }[]
  >([
    { id: 0, value: "" },
    { id: 1, value: "" },
  ]);

  // Quiz tab state
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<number>(0);

  const addLesson = useAddLesson();
  const addPoll = useAddPoll();
  const addQuizQuestion = useAddQuizQuestion();

  const { data: lessons, isLoading: lessonsLoading } = useGetLessons(
    classNum,
    subject,
  );
  const { data: polls, isLoading: pollsLoading } = useGetPolls(
    classNum,
    subject,
  );
  const { data: quizQuestions, isLoading: quizLoading } = useGetQuizQuestions(
    classNum,
    subject,
  );

  // ── PDF Submit ──
  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title zaroor bharein!");
      return;
    }
    if (!pdfUrl.trim()) {
      toast.error("PDF URL zaroor daalo!");
      return;
    }
    try {
      await addLesson.mutateAsync({
        classNum,
        subject,
        lesson: {
          title: title.trim(),
          description: description.trim(),
          pdfUrl: pdfUrl.trim(),
          videoUrl: "",
          notes: "",
        },
      });
      toast.success("PDF Lesson add ho gaya! 📄");
      setTitle("");
      setDescription("");
      setPdfUrl("");
    } catch {
      toast.error("PDF Lesson add nahi ho saka. Dobara try karein.");
    }
  };

  // ── Video Submit ──
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title zaroor bharein!");
      return;
    }
    if (!videoUrl.trim()) {
      toast.error("Video URL zaroor daalo!");
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
          pdfUrl: "",
          notes: "",
        },
      });
      toast.success("Video Lesson add ho gaya! 🎥");
      setTitle("");
      setDescription("");
      setVideoUrl("");
    } catch {
      toast.error("Video Lesson add nahi ho saka. Dobara try karein.");
    }
  };

  // ── Notes Submit ──
  const handleNotesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title zaroor bharein!");
      return;
    }
    if (!notes.trim()) {
      toast.error("Notes ka content zaroor likhein!");
      return;
    }
    try {
      await addLesson.mutateAsync({
        classNum,
        subject,
        lesson: {
          title: title.trim(),
          description: description.trim(),
          notes: notes.trim(),
          pdfUrl: "",
          videoUrl: "",
        },
      });
      toast.success("Notes Lesson add ho gaya! 📝");
      setTitle("");
      setDescription("");
      setNotes("");
    } catch {
      toast.error("Notes Lesson add nahi ho saka. Dobara try karein.");
    }
  };

  // ── Poll Submit ──
  const handlePollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim()) {
      toast.error("Poll question zaroor likhein!");
      return;
    }
    const filledOptions = pollOptions.filter((o) => o.value.trim());
    if (filledOptions.length < 2) {
      toast.error("Kam se kam 2 options zaroor bharein!");
      return;
    }
    try {
      await addPoll.mutateAsync({
        classNum,
        subject,
        pollData: {
          question: pollQuestion.trim(),
          options: pollOptions
            .map((o) => o.value.trim())
            .filter((v) => v.length > 0),
        },
      });
      toast.success("Poll add ho gaya! 📊");
      setPollQuestion("");
      setPollNextId(2);
      setPollOptions([
        { id: 0, value: "" },
        { id: 1, value: "" },
      ]);
    } catch {
      toast.error("Poll add nahi ho saka. Dobara try karein.");
    }
  };

  // ── Quiz Submit ──
  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizQuestion.trim()) {
      toast.error("Question zaroor bharein!");
      return;
    }
    const filledOptions = quizOptions.filter((o) => o.trim());
    if (filledOptions.length < 2) {
      toast.error("Kam se kam 2 options zaroor bharein!");
      return;
    }
    try {
      await addQuizQuestion.mutateAsync({
        classNum,
        subject,
        question: {
          question: quizQuestion.trim(),
          options: quizOptions.map((o) => o.trim()),
          correctIndex: BigInt(correctIndex),
        },
      });
      toast.success("Question add ho gaya! 🧠");
      setQuizQuestion("");
      setQuizOptions(["", "", "", ""]);
      setCorrectIndex(0);
    } catch {
      toast.error("Question add nahi ho saka. Dobara try karein.");
    }
  };

  // Poll option helpers
  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions((prev) => [...prev, { id: pollNextId, value: "" }]);
      setPollNextId((n) => n + 1);
    }
  };
  const removePollOption = (id: number) => {
    if (pollOptions.length > 2) {
      setPollOptions((prev) => prev.filter((o) => o.id !== id));
    }
  };
  const updatePollOption = (id: number, value: string) => {
    setPollOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, value } : o)),
    );
  };

  // Quiz option helper
  const handleQuizOptionChange = (idx: number, value: string) => {
    setQuizOptions((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      {/* Content Type Tabs */}
      <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
          <CardTitle className="font-display font-bold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Content Add Karein
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Neeche se content type chuniye aur content add karein
          </p>
        </CardHeader>
        <CardContent className="pt-5 pb-6">
          <Tabs defaultValue="pdf">
            {/* Content type selector tabs */}
            <TabsList className="w-full mb-6 rounded-2xl h-auto flex-wrap gap-1 bg-secondary/80 p-1.5">
              <TabsTrigger
                value="pdf"
                data-ocid="admin.content.pdf.tab"
                className="flex-1 min-w-[80px] rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold text-xs py-2.5 gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                PDF
              </TabsTrigger>
              <TabsTrigger
                value="video"
                data-ocid="admin.content.video.tab"
                className="flex-1 min-w-[80px] rounded-xl data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold text-xs py-2.5 gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                Video
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                data-ocid="admin.content.notes.tab"
                className="flex-1 min-w-[80px] rounded-xl data-[state=active]:bg-green-600 data-[state=active]:text-white font-semibold text-xs py-2.5 gap-1.5"
              >
                <StickyNote className="w-3.5 h-3.5" />
                Notes
              </TabsTrigger>
              <TabsTrigger
                value="poll"
                data-ocid="admin.content.poll.tab"
                className="flex-1 min-w-[80px] rounded-xl data-[state=active]:bg-violet-600 data-[state=active]:text-white font-semibold text-xs py-2.5 gap-1.5"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Poll
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                data-ocid="admin.content.quiz.tab"
                className="flex-1 min-w-[80px] rounded-xl data-[state=active]:bg-amber-600 data-[state=active]:text-white font-semibold text-xs py-2.5 gap-1.5"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                Quiz
              </TabsTrigger>
            </TabsList>

            {/* ── PDF Tab ── */}
            <TabsContent value="pdf">
              <form onSubmit={handlePdfSubmit} className="space-y-4">
                {/* Common fields */}
                <CommonLessonFields
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  titleOcid="admin.lesson.pdf.title.input"
                  descOcid="admin.lesson.pdf.description.textarea"
                />

                {/* PDF specific */}
                <div className="space-y-2">
                  <Label
                    htmlFor="lesson-pdf-url"
                    className="text-sm font-semibold text-blue-700 dark:text-blue-400"
                  >
                    📄 PDF ka URL daalo ya paste karo
                  </Label>
                  <Input
                    id="lesson-pdf-url"
                    data-ocid="admin.lesson.pdf.input"
                    placeholder="https://drive.google.com/... ya koi bhi PDF link"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    Google Drive, Dropbox, ya kisi bhi hosting ka PDF link paste
                    karein
                  </p>
                </div>

                <Button
                  type="submit"
                  data-ocid="admin.lesson.pdf.submit_button"
                  disabled={addLesson.isPending}
                  className="w-full h-11 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {addLesson.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  PDF Lesson Save Karein
                </Button>
              </form>
            </TabsContent>

            {/* ── Video Tab ── */}
            <TabsContent value="video">
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                {/* Common fields */}
                <CommonLessonFields
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  titleOcid="admin.lesson.video.title.input"
                  descOcid="admin.lesson.video.description.textarea"
                />

                {/* Video specific */}
                <div className="space-y-2">
                  <Label
                    htmlFor="lesson-video-url"
                    className="text-sm font-semibold text-red-700 dark:text-red-400"
                  >
                    🎥 YouTube ya Video URL daalo ya paste karo
                  </Label>
                  <Input
                    id="lesson-video-url"
                    data-ocid="admin.lesson.video.input"
                    placeholder="https://youtube.com/embed/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="rounded-xl border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    YouTube embed URL use karein — example:
                    https://youtube.com/embed/VIDEO_ID
                  </p>
                </div>

                <Button
                  type="submit"
                  data-ocid="admin.lesson.video.submit_button"
                  disabled={addLesson.isPending}
                  className="w-full h-11 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white"
                >
                  {addLesson.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Video className="w-4 h-4 mr-2" />
                  )}
                  Video Lesson Save Karein
                </Button>
              </form>
            </TabsContent>

            {/* ── Notes Tab ── */}
            <TabsContent value="notes">
              <form onSubmit={handleNotesSubmit} className="space-y-4">
                {/* Common fields */}
                <CommonLessonFields
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  titleOcid="admin.lesson.notes.title.input"
                  descOcid="admin.lesson.notes.description.textarea"
                />

                {/* Notes specific */}
                <div className="space-y-2">
                  <Label
                    htmlFor="lesson-notes-content"
                    className="text-sm font-semibold text-green-700 dark:text-green-400"
                  >
                    📝 Notes yahan type karo ya paste karo
                  </Label>
                  <Textarea
                    id="lesson-notes-content"
                    data-ocid="admin.lesson.notes.textarea"
                    placeholder="Key points, formulas, important topics... aap yahan seedha likh sakte hain ya copy-paste kar sakte hain"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="rounded-xl resize-y font-mono text-sm border-green-200 focus:border-green-500 focus:ring-green-200 min-h-[200px]"
                    rows={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Direct type karein ya khin se copy karke yahan paste karein
                    (Ctrl+V)
                  </p>
                </div>

                <Button
                  type="submit"
                  data-ocid="admin.lesson.notes.submit_button"
                  disabled={addLesson.isPending}
                  className="w-full h-11 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white"
                >
                  {addLesson.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <StickyNote className="w-4 h-4 mr-2" />
                  )}
                  Notes Lesson Save Karein
                </Button>
              </form>
            </TabsContent>

            {/* ── Poll Tab ── */}
            <TabsContent value="poll">
              <form onSubmit={handlePollSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="poll-question"
                    className="text-sm font-semibold text-violet-700 dark:text-violet-400"
                  >
                    📊 Poll Question likhein
                  </Label>
                  <Textarea
                    id="poll-question"
                    data-ocid="admin.poll.question.textarea"
                    placeholder="Apna poll question yahan likhein..."
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="rounded-xl resize-none border-violet-200 focus:border-violet-500 focus:ring-violet-200"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Poll Options ({pollOptions.length}/6)
                  </Label>
                  <div className="space-y-2">
                    {pollOptions.map((opt, idx) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-6 text-center shrink-0">
                          {idx + 1}.
                        </span>
                        <Input
                          data-ocid={`admin.poll.option.input.${idx + 1}`}
                          placeholder={`Option ${idx + 1}...`}
                          value={opt.value}
                          onChange={(e) =>
                            updatePollOption(opt.id, e.target.value)
                          }
                          className="rounded-xl flex-1 border-violet-200 focus:border-violet-500"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            data-ocid={`admin.poll.option.delete_button.${idx + 1}`}
                            onClick={() => removePollOption(opt.id)}
                            className="text-destructive/60 hover:text-destructive transition-colors p-1 rounded-lg"
                            aria-label="Option hatao"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {pollOptions.length < 6 && (
                    <Button
                      type="button"
                      data-ocid="admin.poll.option.primary_button"
                      onClick={addPollOption}
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-violet-300 text-violet-700 hover:bg-violet-50 font-semibold"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Option Add Karein
                    </Button>
                  )}
                </div>

                <Button
                  type="submit"
                  data-ocid="admin.poll.submit_button"
                  disabled={addPoll.isPending}
                  className="w-full h-11 rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {addPoll.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <BarChart2 className="w-4 h-4 mr-2" />
                  )}
                  Poll Save Karein
                </Button>
              </form>

              {/* Existing Polls */}
              {(pollsLoading || (polls && polls.length > 0)) && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-violet-600" />
                    Existing Polls
                    {polls && (
                      <Badge variant="secondary" className="ml-1">
                        {polls.length}
                      </Badge>
                    )}
                  </h4>
                  {pollsLoading ? (
                    <div
                      data-ocid="admin.polls.loading_state"
                      className="flex items-center gap-2 text-muted-foreground py-4"
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                      <span className="text-sm">
                        Polls load ho rahe hain...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {polls?.map((poll, i) => (
                        <div
                          key={`${poll.question.slice(0, 20)}-${i}`}
                          data-ocid={`admin.poll.item.${i + 1}`}
                          className="bg-violet-50 border border-violet-200 rounded-xl p-3"
                        >
                          <p className="text-sm font-semibold text-violet-900 mb-2">
                            {poll.question}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {poll.options.map((opt, optIdx) => (
                              <span
                                key={`opt-${opt}-${poll.question.slice(0, 10)}-${optIdx}`}
                                className="text-xs px-2.5 py-1 rounded-lg bg-violet-100 text-violet-700 font-medium"
                              >
                                {optIdx + 1}. {opt}{" "}
                                <span className="text-violet-400">
                                  ({Number(poll.votes[optIdx] ?? 0)} votes)
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* ── Quiz Tab ── */}
            <TabsContent value="quiz">
              <form onSubmit={handleQuizSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="quiz-question"
                    className="text-sm font-semibold text-amber-700 dark:text-amber-400"
                  >
                    🧠 Quiz Question likhein
                  </Label>
                  <Textarea
                    id="quiz-question"
                    data-ocid="admin.quiz.question.textarea"
                    placeholder="Aapka question yahan likhein..."
                    value={quizQuestion}
                    onChange={(e) => setQuizQuestion(e.target.value)}
                    className="rounded-xl resize-none border-amber-200 focus:border-amber-500 focus:ring-amber-200"
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
                          value={quizOptions[idx]}
                          onChange={(e) =>
                            handleQuizOptionChange(idx, e.target.value)
                          }
                          className="rounded-xl border-amber-200 focus:border-amber-500"
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
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-border bg-card text-muted-foreground hover:border-amber-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={idx}
                          checked={correctIndex === idx}
                          onChange={() => setCorrectIndex(idx)}
                          className="w-4 h-4 accent-amber-500"
                          data-ocid={`admin.quiz.correct.radio.${idx + 1}`}
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
                  className="w-full h-11 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {addQuizQuestion.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <BrainCircuit className="w-4 h-4 mr-2" />
                  )}
                  Question Add Karein
                </Button>
              </form>

              {/* Existing Quiz Questions */}
              {(quizLoading || (quizQuestions && quizQuestions.length > 0)) && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-amber-600" />
                    Existing Questions
                    {quizQuestions && (
                      <Badge variant="secondary" className="ml-1">
                        {quizQuestions.length}
                      </Badge>
                    )}
                  </h4>
                  {quizLoading ? (
                    <div
                      data-ocid="admin.quiz.loading_state"
                      className="flex items-center gap-2 text-muted-foreground py-4"
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                      <span className="text-sm">
                        Questions load ho rahe hain...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quizQuestions?.map((q, i) => (
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
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Existing Lessons List */}
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
            <p className="text-xs mt-1">Upar se content add karein!</p>
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
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                      {lesson.notes && (
                        <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                          📝 Notes
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

// ─── Shared Common Lesson Fields Component ─────────────────────────────────────

function CommonLessonFields({
  title,
  setTitle,
  description,
  setDescription,
  titleOcid,
  descOcid,
}: {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  titleOcid: string;
  descOcid: string;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={titleOcid} className="text-sm font-semibold">
          Lesson Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id={titleOcid}
          data-ocid={titleOcid}
          placeholder="e.g. Chapter 1 — Integers ka Introduction"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={descOcid} className="text-sm font-semibold">
          Description{" "}
          <span className="text-muted-foreground text-xs font-normal">
            (optional)
          </span>
        </Label>
        <Textarea
          id={descOcid}
          data-ocid={descOcid}
          placeholder="Is lesson mein kya sikhenge..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl resize-none"
          rows={2}
        />
      </div>

      <div className="border-t border-dashed border-border pt-4" />
    </>
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
            PDF, Video, Notes, Poll, Quiz aur student doubts manage karein
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
              Lessons &amp; Notes
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
