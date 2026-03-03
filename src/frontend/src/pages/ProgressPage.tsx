import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetCompletedLessons, useGetQuizScores } from "../hooks/useQueries";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function ScoreGrade(score: number, total = 5): string {
  const pct = (score / total) * 100;
  if (pct >= 80) return "A+";
  if (pct >= 60) return "B";
  if (pct >= 40) return "C";
  return "D";
}

function GradeBadge({ score }: { score: number }) {
  const grade = ScoreGrade(score);
  const colors: Record<string, string> = {
    "A+": "bg-green-100 text-green-700 border-green-300",
    B: "bg-blue-100 text-blue-700 border-blue-300",
    C: "bg-amber-100 text-amber-700 border-amber-300",
    D: "bg-red-100 text-red-700 border-red-300",
  };
  return (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors[grade] ?? colors.D}`}
    >
      {grade}
    </span>
  );
}

export default function ProgressPage() {
  const { data: completedLessons, isLoading: lessonsLoading } =
    useGetCompletedLessons();

  const { data: quizScores, isLoading: scoresLoading } = useGetQuizScores();

  const isLoading = lessonsLoading || scoresLoading;

  // Group completed lessons by class+subject
  const groupedLessons: Record<
    string,
    { classNum: string; subject: string; lessons: string[] }
  > = {};
  if (completedLessons) {
    for (const [classNum, subject, title] of completedLessons) {
      const key = `Class ${classNum} — ${subject}`;
      if (!groupedLessons[key]) {
        groupedLessons[key] = {
          classNum: String(classNum),
          subject,
          lessons: [],
        };
      }
      groupedLessons[key].lessons.push(title);
    }
  }

  const lessonGroups = Object.entries(groupedLessons);
  const totalLessons = completedLessons?.length ?? 0;
  const totalQuizzes = quizScores?.length ?? 0;
  const avgScore =
    quizScores && quizScores.length > 0
      ? Math.round(
          quizScores.reduce((acc, [, , s]) => acc + Number(s), 0) /
            quizScores.length,
        )
      : 0;

  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="progress.page"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h1 className="font-display font-black text-3xl text-foreground">
            Aapki Progress
          </h1>
        </div>
        <p className="text-muted-foreground ml-9">
          Aapne kitna padha, kitne quiz diye — sab yahan dekhein!
        </p>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="progress.loading_state"
          className="flex items-center justify-center py-20 gap-3 text-muted-foreground"
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span>Progress load ho rahi hai...</span>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Stats cards */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={itemVariants}
              className="bg-card rounded-2xl border border-border p-5 text-center"
            >
              <div className="text-3xl font-display font-black text-primary">
                {totalLessons}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">
                Lessons Complete
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-card rounded-2xl border border-border p-5 text-center"
            >
              <div className="text-3xl font-display font-black text-primary">
                {totalQuizzes}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">
                Quizzes Diye
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-card rounded-2xl border border-border p-5 text-center"
            >
              <div className="text-3xl font-display font-black text-primary">
                {avgScore}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">
                Avg Score
              </div>
            </motion.div>
          </motion.div>

          {/* Empty state */}
          {totalLessons === 0 && totalQuizzes === 0 && (
            <div
              data-ocid="progress.empty_state"
              className="flex flex-col items-center py-20 gap-4 text-center"
            >
              <div className="text-6xl">📊</div>
              <h3 className="font-display font-bold text-xl text-foreground">
                Abhi Koi Progress Nahi
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Koi class choose karein, lessons complete karein, aur quiz dein
                — progress yahan track hogi!
              </p>
            </div>
          )}

          {/* Completed Lessons */}
          {lessonGroups.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl text-foreground">
                  Completed Lessons
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {totalLessons}
                </Badge>
              </div>

              <motion.div
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {lessonGroups.map(([groupKey, group]) => (
                  <motion.div
                    key={groupKey}
                    variants={itemVariants}
                    className="bg-card border border-border rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant="outline"
                        className="text-xs font-semibold"
                      >
                        Class {group.classNum}
                      </Badge>
                      <span className="font-display font-bold text-base text-foreground">
                        {group.subject}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.lessons.map((title) => (
                        <div
                          key={title}
                          className="flex items-center gap-1.5 text-sm bg-green-50 border border-green-200 text-green-700 rounded-xl px-3 py-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {title}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* Quiz Scores */}
          {quizScores && quizScores.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl text-foreground">
                  Quiz Scores
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {totalQuizzes}
                </Badge>
              </div>

              <motion.div
                className="grid sm:grid-cols-2 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {quizScores.map(([classNum, subject, score], i) => (
                  <motion.div
                    key={`${String(classNum)}-${subject}-${i}`}
                    variants={itemVariants}
                    className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className="text-xs font-semibold"
                        >
                          Class {String(classNum)}
                        </Badge>
                        <span className="font-semibold text-sm text-foreground">
                          {subject}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Score: {String(score)} marks
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <GradeBadge score={Number(score)} />
                      <span className="text-2xl font-display font-black text-primary">
                        {String(score)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
