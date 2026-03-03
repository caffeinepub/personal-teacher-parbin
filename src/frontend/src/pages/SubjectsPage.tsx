import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { BookOpen, ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useGetSubjects } from "../hooks/useQueries";

// Subject icons and colors
const SUBJECT_CONFIG: Record<
  string,
  { emoji: string; color: string; bg: string }
> = {
  Maths: {
    emoji: "🔢",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  Mathematics: {
    emoji: "🔢",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  Science: {
    emoji: "🔬",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
  },
  English: {
    emoji: "📖",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
  },
  Hindi: {
    emoji: "🇮🇳",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
  },
  "Social Science": {
    emoji: "🌍",
    color: "text-teal-700",
    bg: "bg-teal-50 border-teal-200",
  },
  Computer: {
    emoji: "💻",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  History: {
    emoji: "🏛️",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  Geography: {
    emoji: "🗺️",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  Physics: {
    emoji: "⚛️",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  Chemistry: {
    emoji: "🧪",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
  },
  Biology: {
    emoji: "🌿",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
  },
};

const FALLBACK_SUBJECTS = [
  "Maths",
  "Science",
  "English",
  "Hindi",
  "Social Science",
  "Computer",
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function SubjectsPage() {
  const { classNum } = useParams({ from: "/class/$classNum" });
  const navigate = useNavigate();
  const classNumInt = Number.parseInt(classNum, 10);

  const { data: subjects, isLoading, isError } = useGetSubjects(classNumInt);

  const displaySubjects =
    subjects && subjects.length > 0 ? subjects : FALLBACK_SUBJECTS;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/" })}
          className="rounded-xl"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground font-medium">
            Aapne Chuna
          </p>
          <h1 className="font-display font-black text-3xl text-foreground">
            Class {classNum}
          </h1>
        </div>
        <div className="ml-auto w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-warm">
          <span className="font-display font-black text-white text-lg">
            {classNum}
          </span>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="subject.loading_state"
          className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Subjects load ho rahe hain...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          data-ocid="subject.error_state"
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-destructive" />
          </div>
          <p className="text-muted-foreground">
            Subjects load nahi ho sake. Thodi der baad try karein.
          </p>
        </div>
      )}

      {/* Subjects grid */}
      {!isLoading && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {displaySubjects.map((subject, idx) => {
            const config = SUBJECT_CONFIG[subject] ?? {
              emoji: "📚",
              color: "text-foreground",
              bg: "bg-secondary border-border",
            };

            return (
              <motion.div
                key={subject}
                variants={itemVariants}
                data-ocid={`subject.item.${idx + 1}`}
                onClick={() =>
                  navigate({
                    to: "/class/$classNum/subject/$subject",
                    params: { classNum, subject },
                  })
                }
                className={`subject-card border-2 ${config.bg} cursor-pointer`}
              >
                <div className="text-4xl mb-3">{config.emoji}</div>
                <h3
                  className={`font-display font-bold text-lg ${config.color} leading-tight`}
                >
                  {subject}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Class {classNum} ke lessons
                </p>
                <div
                  className={`mt-4 text-xs font-semibold ${config.color} flex items-center gap-1 opacity-70`}
                >
                  Padhna shuru karein →
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
