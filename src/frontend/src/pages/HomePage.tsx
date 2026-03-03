import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, MessageCircle, Sparkles, Trophy } from "lucide-react";
import { motion } from "motion/react";

const CLASS_COLORS = [
  "from-orange-400 to-amber-500",
  "from-yellow-400 to-orange-400",
  "from-green-400 to-emerald-500",
  "from-teal-400 to-cyan-500",
  "from-blue-400 to-indigo-500",
  "from-violet-400 to-purple-500",
  "from-pink-400 to-rose-500",
  "from-red-400 to-orange-500",
  "from-amber-400 to-yellow-500",
  "from-lime-400 to-green-500",
  "from-cyan-400 to-sky-500",
  "from-indigo-400 to-blue-500",
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Video Lectures",
    desc: "Har subject ke engaging video classes",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Trophy,
    title: "Quiz & Tests",
    desc: "Apni knowledge test karo aur improve karo",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: MessageCircle,
    title: "Doubt Solving",
    desc: "Koi bhi doubt — hum hain na!",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Sparkles,
    title: "AI Teacher Parbin",
    desc: "24/7 available personal AI teacher",
    color: "bg-blue-100 text-blue-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden dot-pattern">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 50%, oklch(0.82 0.14 75 / 0.5), transparent), radial-gradient(ellipse 60% 80% at 20% 30%, oklch(0.68 0.19 50 / 0.3), transparent)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 flex flex-col md:flex-row items-center gap-8">
          {/* Text */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Badge
              variant="secondary"
              className="mb-4 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary"
            >
              <Sparkles className="w-3 h-3 mr-1.5" />
              Class 1 se 12 tak — Sabke liye!
            </Badge>

            <h1 className="font-display font-black text-4xl sm:text-5xl leading-tight text-foreground mb-3">
              PERSONAL TEACHER{" "}
              <span
                className="text-primary"
                style={{
                  textShadow: "0 2px 20px oklch(0.68 0.19 50 / 0.3)",
                }}
              >
                PARBIN
              </span>
            </h1>
            <p className="font-body text-lg text-muted-foreground mb-2">
              Aapka Personal Teacher —
            </p>
            <p className="font-serif text-2xl text-foreground font-semibold mb-6">
              Har Class, Har Subject 📚
            </p>
            <p className="text-muted-foreground text-base max-w-md mx-auto md:mx-0 mb-8">
              India ke har student ke liye ek free, AI-powered personal teacher.
              Videos, notes, quiz, aur doubt solving — sab ek jagah!
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <motion.button
                onClick={() => {
                  const el = document.getElementById("class-grid");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-2xl shadow-warm hover:shadow-warm-lg transition-shadow duration-200"
              >
                Apni Class Chuno →
              </motion.button>
              <motion.button
                onClick={() => navigate({ to: "/chat" })}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-2xl border border-border hover:border-primary/30 transition-colors duration-200"
              >
                AI Teacher se Baat Karo
              </motion.button>
            </div>
          </motion.div>

          {/* Mascot */}
          <motion.div
            className="flex-shrink-0 w-56 sm:w-72 md:w-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <div className="animate-float drop-shadow-2xl">
              <img
                src="/assets/generated/parbin-mascot-transparent.dim_400x400.png"
                alt="Parbin — Aapka AI Teacher"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features row */}
      <section className="bg-secondary/40 border-y border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center gap-2 p-4"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${f.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-sm text-foreground">
                    {f.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Class Grid */}
      <section id="class-grid" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="font-display font-bold text-3xl text-foreground mb-2">
            Apni Class Chuniye
          </h2>
          <p className="text-muted-foreground">
            Class 1 se lekar Class 12 tak — sabhi ke liye lessons taiyaar hain!
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((classNum) => (
            <motion.div
              key={classNum}
              variants={itemVariants}
              data-ocid={`home.class.item.${classNum}`}
              onClick={() =>
                navigate({
                  to: "/class/$classNum",
                  params: { classNum: String(classNum) },
                })
              }
              className="class-card aspect-square flex flex-col items-center justify-center gap-1 select-none"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${CLASS_COLORS[classNum - 1]} opacity-90 rounded-2xl`}
              />
              <div className="relative z-10 text-center text-white">
                <div className="font-display font-black text-2xl sm:text-3xl leading-none">
                  {classNum}
                </div>
                <div className="font-body text-xs font-semibold uppercase tracking-widest mt-1 opacity-90">
                  Class
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
